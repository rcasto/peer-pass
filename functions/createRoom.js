/**
 * Proposed room schema:
 * {
 *     name: string;
 *     password?: string;
 *     offers: string[];
 * }
 */

/**
 * Questions:
 * - How does a room remain active?
 * - How is contention resolved for offers? Blob storage won't handle this. 2 peers could grab the same offer.
 */
exports.createRoom = (req, res) => {

};