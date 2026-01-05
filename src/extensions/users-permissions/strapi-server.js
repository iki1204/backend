'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const { compact, concat, isArray } = require('lodash/fp');
const { errors } = require('@strapi/utils');
const {
  validateRegisterBody,
} = require('@strapi/plugin-users-permissions/server/controllers/validation/auth');

const { ApplicationError, ValidationError } = errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

const extractDeviceId = (requestBody) => {
  const { deviceId } = requestBody || {};

  return typeof deviceId === 'string' && deviceId.length > 0 ? deviceId : undefined;
};

const getService = (name) => strapi.plugin('users-permissions').service(name);

module.exports = (plugin) => {
  plugin.controllers.auth.register = async (ctx) => {
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });

    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    const { register } = strapi.config.get('plugin::users-permissions');
    const alwaysAllowedKeys = ['username', 'password', 'email'];

    const allowedKeys = compact(
      concat(alwaysAllowedKeys, isArray(register?.allowedFields) ? register.allowedFields : [])
    );

    const invalidKeys = Object.keys(ctx.request.body).filter((key) => !allowedKeys.includes(key));

    if (invalidKeys.length > 0) {
      throw new ValidationError(`Invalid parameters: ${invalidKeys.join(', ')}`);
    }

    const params = {
      ..._.pick(ctx.request.body, allowedKeys),
      provider: 'local',
    };

    const validations = strapi.config.get('plugin::users-permissions.validationRules');

    await validateRegisterBody(params, validations);

    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    const { email, username, provider } = params;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi.db.query('plugin::users-permissions.user').count({
      where: { ...identifierFilter, provider },
    });

    if (conflictingUserCount > 0) {
      throw new ApplicationError('Email or Username are already taken');
    }

    if (settings.unique_email) {
      const conflictingUserCount = await strapi.db.query('plugin::users-permissions.user').count({
        where: { ...identifierFilter },
      });

      if (conflictingUserCount > 0) {
        throw new ApplicationError('Email or Username are already taken');
      }
    }

    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      username,
      confirmed: false,
    };

    const user = await getService('user').add(newUser);

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await getService('user').sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        strapi.log.error(err);
        throw new ApplicationError('Error sending confirmation email');
      }

      return ctx.send({ user: sanitizedUser });
    }

    const mode = strapi.config.get('plugin::users-permissions.jwtManagement', 'legacy-support');
    if (mode === 'refresh') {
      const deviceId = extractDeviceId(ctx.request.body) || crypto.randomUUID();

      const refresh = await strapi
        .sessionManager('users-permissions')
        .generateRefreshToken(String(user.id), deviceId, { type: 'refresh' });

      const access = await strapi
        .sessionManager('users-permissions')
        .generateAccessToken(refresh.token);
      if ('error' in access) {
        throw new ApplicationError('Invalid credentials');
      }

      return ctx.send({ jwt: access.token, refreshToken: refresh.token, user: sanitizedUser });
    }

    const jwt = getService('jwt').issue(_.pick(user, ['id']));
    return ctx.send({ jwt, user: sanitizedUser });
  };

  return plugin;
};