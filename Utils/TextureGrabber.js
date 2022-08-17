const textureCache = new Map()

export const whiteTile = new java.awt.image.BufferedImage(16, 16, java.awt.image.BufferedImage.TYPE_INT_ARGB)
whiteTile.getRaster().getDataBuffer().getData().fill(java.awt.Color.WHITE.getRGB())

export function getTexture(block) {
    if (block.type.getRegistryName() == "minecraft:air") return null

    // If texture isn't cached
    if (!textureCache.has(block.type.getRegistryName())) {
        let textureSprite = Client.getMinecraft().func_175602_ab().func_175023_a().func_178122_a(block.getState())    
                        
        let iconName = textureSprite.func_94215_i() + ".png"
        if (block.type.getRegistryName() == "minecraft:grass") iconName = "minecraft:blocks/grass_top.png"
        else if (block.type.getRegistryName().includes("sandstone")) iconName = "minecraft:blocks/sandstone_top.png"
        else if (block.type.getRegistryName().includes("log")) iconName = iconName.replace(".png", "_top.png")
        else if (block.type.mcBlock == net.minecraft.init.Blocks.field_150419_aX) iconName = "minecraft:blocks/mushroom_block_skin_red.png"
        else if (block.type.mcBlock == net.minecraft.init.Blocks.field_150420_aW) iconName = "minecraft:blocks/mushroom_block_skin_brown.png"
        else if (block.type.mcBlock instanceof net.minecraft.block.BlockOre && block.type.mcBlock != net.minecraft.init.Blocks.field_150449_bY) iconName = "minecraft:blocks/stone.png"

        let resourceLocation = new net.minecraft.util.ResourceLocation("minecraft", "textures/" + iconName.replace("minecraft:", ""))

        let image = net.minecraft.client.renderer.texture.TextureUtil.func_177053_a(Client.getMinecraft().func_110442_L().func_110536_a(resourceLocation).func_110527_b())

        textureCache.set(block.type.getRegistryName(), image)
        return image
    } else return textureCache.get(block.type.getRegistryName())
}