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
import {EntitySchema} from "../../abstract/entitySchema";
import {EntityValidationError} from '../../abstract/entityValidationError';
import {GenerateGpgKeyPairEntity} from "./generateGpgKeyPairEntity";

describe("GenerateGpgKeyPair entity", () => {
  it("schema must validate", () => {
    EntitySchema.validateSchema(GenerateGpgKeyPairEntity.ENTITY_NAME, GenerateGpgKeyPairEntity.getSchema());
  });

  it("constructor works if valid DTO is provided", () => {
    const dto = {
      name: "Jean-Jacky",
      email: "jj@passbolt.com",
      passphrase: "ultra-secure",
      keySize: 4096
    };
    const entity = new GenerateGpgKeyPairEntity(dto);
    expect(entity.toDto()).toEqual(dto);
  });

  it("constructor throws an exception if DTO contains invalid field", () => {
    try {
      const dto = {
        name: "",
        email: "@passbolt.com",
        passphrase: "",
        keySize: 128
      };
      new GenerateGpgKeyPairEntity(dto);
    } catch (error) {
      expect((error instanceof EntityValidationError)).toBe(true);
      expect(error.hasError('name', 'minLength')).toBe(true);
      expect(error.hasError('email', 'custom')).toBe(true);
      expect(error.hasError('passphrase', 'minLength')).toBe(true);
      expect(error.hasError('keySize', 'enum')).toBe(true);
    }
  });
});