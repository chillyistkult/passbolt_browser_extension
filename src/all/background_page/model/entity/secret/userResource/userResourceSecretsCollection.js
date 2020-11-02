/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.13.0
 */
const {EntityCollection} = require('../../abstract/entityCollection');
const {EntitySchema} = require('../../abstract/entitySchema');
const {EntityCollectionError} = require('../../abstract/entityCollectionError');
const {SecretEntity} = require('../secretEntity');

const ENTITY_NAME = 'UserResourceSecrets';

const RULE_UNIQUE_ID = 'unique_id';
const RULE_UNIQUE_USER_ID = 'unique_user_id';
const RULE_SAME_RESOURCE = 'same_resource';

class UserResourceSecretsCollection extends EntityCollection {
  /**
   * UserResourceSecrets Collection constructor
   *
   * @param {Object} userResourceSecretsCollectionDto secrets DTO
   * @throws EntityValidationError if the dto cannot be converted into an entity
   */
  constructor(userResourceSecretsCollectionDto) {
    super(EntitySchema.validate(
      UserResourceSecretsCollection.ENTITY_NAME,
      userResourceSecretsCollectionDto,
      UserResourceSecretsCollection.getSchema()
    ));

    // Note: there is no "multi-item" validation
    // Collection validation will fail at the first item that doesn't validate
    this._props.forEach(secret => {
      this.push(new SecretEntity(secret));
    });

    // We do not keep original props
    this._props = null;
  }

  /**
   * Get collection schema
   *
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "array",
      "items": SecretEntity.getSchema(),
    }
  }

  /**
   * Get secrets
   * @returns {Array<SecretEntity>}
   */
  get secrets() {
    return this._items;
  }

  // ==================================================
  // Assertions
  // ==================================================
  /**
   * Assert there is no other secret with the same id in the collection
   *
   * @param {SecretEntity} secret
   * @throws {EntityValidationError} if a secret with the same id already exist
   */
  assertUniqueId(secret) {
    if (!secret.id) {
      return;
    }
    const length = this.secrets.length;
    let i = 0;
    for(; i < length; i++) {
      let existingSecret = this.secrets[i];
      if (existingSecret.id && existingSecret.id === secret.id) {
        throw new EntityCollectionError(i, UserResourceSecretsCollection.RULE_UNIQUE_ID, `Secret id ${secret.id} already exists.`);
      }
    }
  }

  /**
   * Assert there is no other secret with the same user id in the collection
   *
   * @param {SecretEntity} secret
   * @throws {EntityValidationError} if a secret with the same id already exist
   */
  assertUniqueUserId(secret) {
    if (!secret.userId) {
      return;
    }
    const length = this.secrets.length;
    let i = 0;
    for(; i < length; i++) {
      let existingSecret = this.secrets[i];
      if (existingSecret.userId && existingSecret.userId === secret.userId) {
        throw new EntityCollectionError(i, UserResourceSecretsCollection.RULE_UNIQUE_USER_ID, `Secret for user id ${secret.userId} already exists.`);
      }
    }
  }

  /**
   * Assert there the collection is always about the same resource
   *
   * @param {SecretEntity} secretEntity
   * @throws {EntityValidationError} if a secret for another resource already exist
   */
  assertSameResource(secretEntity) {
    if (!this.secrets.length) {
      return;
    }
    if (!secretEntity.resourceId) {
      return;
    }
    if (secretEntity.resourceId !== this.secrets[0].resourceId) {
      const msg = `The collection is already used for another resource with id ${this.secrets[0].resourceId}.`;
      throw new EntityCollectionError(0, UserResourceSecretsCollection.RULE_SAME_RESOURCE, msg);
    }
  }

  // ==================================================
  // Setters
  // ==================================================
  /**
   * Push a copy of the secret to the list
   * @param {object} secret DTO or SecretEntity
   */
  push(secret) {
    if (!secret || typeof secret !== 'object') {
      throw new TypeError(`UserResourceSecretsCollection push parameter should be an object.`);
    }
    if (secret instanceof SecretEntity) {
      secret = secret.toDto(); // clone
    }
    const secretEntity = new SecretEntity(secret); // validate

    // Build rules
    this.assertUniqueId(secretEntity);
    this.assertUniqueUserId(secretEntity);
    this.assertSameResource(secretEntity);

    super.push(secretEntity);
  }

  // ==================================================
  // Static getters
  // ==================================================
  /**
   * UserResourceSecretsCollection.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }

  /**
   * UserResourceSecretsCollection.RULE_UNIQUE_ID
   * @returns {string}
   */
  static get RULE_UNIQUE_ID() {
    return RULE_UNIQUE_ID;
  }

  /**
   * UserResourceSecretsCollection.RULE_UNIQUE_USER_ID
   * @returns {string}
   */
  static get RULE_UNIQUE_USER_ID() {
    return RULE_UNIQUE_USER_ID;
  }

  /**
   * UserResourceSecretsCollection.RULE_SAME_RESOURCE
   * @returns {string}
   */
  static get RULE_SAME_RESOURCE() {
    return RULE_SAME_RESOURCE;
  }
}

exports.UserResourceSecretsCollection = UserResourceSecretsCollection;
