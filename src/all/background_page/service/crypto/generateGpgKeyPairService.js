/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

import ExternalGpgKeyPairEntity from "../../model/entity/gpgkey/external/externalGpgKeyPairEntity";
import * as openpgp from 'openpgp';

class GenerateGpgKeyPairService {
  /**
   * Generate a gpg key pair.
   *
   * @param {GenerateGpgKeyPairOptionsEntity} generateGpgKeyPairOptionsEntity The gpg generation parameter
   * @return {Promise<ExternalGpgKeyPairEntity>}
   */
  static async generateKeyPair(generateGpgKeyPairOptionsEntity) {
    const openpgpGenerateKeyDto = Object.assign(generateGpgKeyPairOptionsEntity.toGenerateOpenpgpKeyDto(), {format: 'armored'});
    const openpgpKeyPair = await openpgp.generateKey(openpgpGenerateKeyDto);

    return new ExternalGpgKeyPairEntity({
      public_key: {armored_key: openpgpKeyPair.publicKey},
      private_key: {armored_key: openpgpKeyPair.privateKey}
    });
  }
}

export default GenerateGpgKeyPairService;
