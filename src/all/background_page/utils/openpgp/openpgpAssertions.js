/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

/**
 * Assert pgp private key(s).
 * - Should be a valid armored key or valid openpgp key.
 * - Should be private.
 *
 * @param {array<openpgp.key.Key|string>|openpgp.key.Key|string} privateKeys The private key(s) to assert.
 * @returns {array<openpgp.key.Key>|openpgp.key.Key}
 * @private
 */
const assertPrivateKeys = async privateKeys => {
  if (Array.isArray(privateKeys)) {
    return privateKeys.map(async key => await assertPrivateKeys(key));
  }

  if (typeof privateKeys === "string") {
    try {
      privateKeys = (await openpgp.key.readArmored(privateKeys)).keys[0];
    } catch (error) {
      throw new Error("The private key is not a valid armored key");
    }
  } else if (!(privateKeys instanceof openpgp.key.Key)) {
    throw new Error("The private keys must be of type string or openpgp.key.Key");
  }

  if (!privateKeys.isPrivate()) {
    throw new Error("The private key is not a valid private key.");
  }

  return privateKeys;
};
exports.assertPrivateKeys = assertPrivateKeys;

/**
 * Assert pgp private decrypted key(s).
 * - Should be a valid armored key or valid openpgp key.
 * - Should be private.
 * - Should be decrypted.
 *
 * @param {array<openpgp.key.Key|string>|openpgp.key.Key|string} privateKeys The private key(s) to assert.
 * @returns {array<openpgp.key.Key>|openpgp.key.Key}
 * @private
 */
const assertDecryptedPrivateKeys = async privateKeys => {
  if (Array.isArray(privateKeys)) {
    return privateKeys.map(async key => await assertDecryptedPrivateKeys(key));
  }

  const privateKey = await assertPrivateKeys(privateKeys);
  if (!privateKey.isDecrypted()) {
    throw new Error("The private key is not decrypted.");
  }

  return privateKey;
};
exports.assertDecryptedPrivateKeys = assertDecryptedPrivateKeys;

/**
 * Assert pgp key(s).
 * - Should be a valid armored key or valid openpgp key.
 *
 * @param {array<openpgp.key.Key|string>|openpgp.key.Key|string} publicKeys The private key(s) to assert.
 * @returns {array<openpgp.key.Key>|openpgp.key.Key}
 * @private
 */
const assertPublicKeys = async keys => {
  if (typeof keys === "string") {
    try {
      keys = (await openpgp.key.readArmored(keys)).keys;
    } catch (error) {
      throw new Error("The public key is not a valid armored key");
    }
  }

  return keys;
};
exports.assertPublicKeys = assertPublicKeys;

/**
 * Assert pgp message.
 * - Should be a valid message.
 *
 * @param {CleartextMessage|string} privateKeys The message to assert.
 * @returns {CleartextMessage}
 * @private
 */
const assertMessage = async message => {
  if (typeof message === "string") {
    try {
      message = await openpgp.message.readArmored(message);
    } catch (error) {
      throw new Error("The message is not a valid cleartext signed message");
    }
  }

  return message;
};
exports.assertMessage = assertMessage;