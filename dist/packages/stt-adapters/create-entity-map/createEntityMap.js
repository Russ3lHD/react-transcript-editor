/**
 * Helper function to flatten a list.
 * Converts nested arrays into one dimensional array
 * @param list - Array to flatten
 * @returns Flattened array
 */
const flatten = (list) => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
/**
 * Helper function to create entityMap from DraftJS blocks
 * @param blocks - DraftJS blocks
 * @returns Entity map for DraftJS
 */
const createEntityMap = (blocks) => {
    const entityRanges = blocks.map(block => block.entityRanges);
    const flatEntityRanges = flatten(entityRanges);
    const entityMap = {};
    flatEntityRanges.forEach((data) => {
        entityMap[data.key] = {
            type: 'WORD',
            mutability: 'MUTABLE',
            data,
        };
    });
    return entityMap;
};
export default createEntityMap;
//# sourceMappingURL=createEntityMap.js.map