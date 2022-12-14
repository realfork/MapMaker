export function scanSurface(radius) {
    ChatLib.chat("\n§3[Map§bMaker] §rBeginning area scan!")
    let startTime = java.lang.System.currentTimeMillis()
    let blocks = []

    let cachedX = Player.getX()
    let cachedZ = Player.getZ()

    for (let x = 0; x < radius * 2; x++) {
        for (let z = 0; z < radius * 2; z++) {
            let pos = new BlockPos(cachedX - radius + x, 0, cachedZ - radius + z)

            let height = World.getChunk(pos.x, 0, pos.z).chunk.func_76611_b(Math.abs(pos.x - 16 * (pos.x >> 4)), Math.abs(pos.z - 16 * (pos.z >> 4)))
            pos = pos.up(height - 1)

            if (World.getBlockAt(pos).type.getRegistryName() == "minecraft:air") blocks.push(null)
            else blocks.push(pos)
        }
    }

    ChatLib.chat(`§3[Map§bMaker] §rFound ${blocks.length} blocks in ${java.lang.System.currentTimeMillis() - startTime}ms!`)
    return blocks
}