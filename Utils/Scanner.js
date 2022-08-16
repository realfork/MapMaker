export function scanSurface(radius) {
    ChatLib.chat("\n§3[Map§bMaker] §rBeginning area scan!")
    let startTime = java.lang.System.currentTimeMillis()
    let blocks = []

    for (let x = 0; x < radius * 2; x++) {
        for (let z = 0; z < radius * 2; z++) {
            let pos = new BlockPos(Player.getX() - (radius / 2) + x, 0, Player.getZ() - (radius / 2) + z)

            let height = World.getChunk(pos.x, 0, pos.z).chunk.func_76611_b(pos.x % 16, pos.z % 16)
            pos = pos.up(height - 1)

            // add transparency checks
            //if (World.getBlockAt(pos).type.mcBlock.func_149730_j()) blocks.push(pos)
            //else blocks.push(null)
            if (World.getBlockAt(pos).type.getRegistryName() == "minecraft:air") blocks.push(null)
            else blocks.push(pos)
        }
    }

    ChatLib.chat(`§3[Map§bMaker] §rFound ${blocks.length} blocks in ${java.lang.System.currentTimeMillis() - startTime}ms!`)
    return blocks
}