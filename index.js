/// <reference types="../CTAutocomplete" />
import { scanSurface } from "./Utils/Scanner"
import { colorGrass, colorLeaves } from "./Utils/Colorizer"

const radius = 128

// maybe add foliage?
// different res texture pack support?

register("command", () => {
    // add radius as argument

    new Thread(() => {
        let blocks = scanSurface(radius)

        // Turn all positions into images
        ChatLib.chat("\n§3[Map§bMaker] §rBeginning image processing!")
        let startTime = java.lang.System.currentTimeMillis()

        let images = []
        blocks.forEach(pos => {
            let image = new java.awt.image.BufferedImage(16, 16, java.awt.image.BufferedImage.TYPE_INT_ARGB)

            if (pos != null) {
                let block = World.getBlockAt(pos)

                // add texture caching for more speeds

                let textureSprite = Client.getMinecraft().func_175602_ab().func_175023_a().func_178122_a(block.getState())    
                
                let iconName = textureSprite.func_94215_i() + ".png"
                if (block.type.getRegistryName() == "minecraft:grass") iconName = "minecraft:blocks/grass_top.png"
                else if (block.type.mcBlock == net.minecraft.init.Blocks.field_150419_aX) iconName = "minecraft:blocks/mushroom_block_skin_red.png"
                else if (block.type.mcBlock == net.minecraft.init.Blocks.field_150420_aW) iconName = "minecraft:blocks/mushroom_block_skin_brown.png"
                else if (block.type.mcBlock instanceof net.minecraft.block.BlockOre && block.type.mcBlock != net.minecraft.init.Blocks.field_150449_bY) iconName = "minecraft:blocks/stone.png"
    
                let resourceLocation = new net.minecraft.util.ResourceLocation("minecraft", "textures/" + iconName.replace("minecraft:", ""))
    
                image = net.minecraft.client.renderer.texture.TextureUtil.func_177053_a(Client.getMinecraft().func_110442_L().func_110536_a(resourceLocation).func_110527_b())

                // Grass and Leaf coloring
                if (block.type.getRegistryName() == "minecraft:grass" || block.type.getRegistryName().includes("leaves")) image = colorGrass(image, pos.toMCBlock())
            // Makes air white
            } else image.getRaster().getDataBuffer().getData().fill(java.awt.Color.WHITE.getRGB())

            images.push(image)
        })
        ChatLib.chat(`§3[Map§bMaker] §rFinished image processing in ${java.lang.System.currentTimeMillis() - startTime}ms!`)

        // Draw map
        ChatLib.chat("\n§3[Map§bMaker] §rBeginning map render!")
        startTime = java.lang.System.currentTimeMillis()

        // Create map image
        let map = new java.awt.image.BufferedImage(Math.ceil(Math.sqrt(images.length)) * 16, Math.ceil(Math.sqrt(images.length)) * 16, java.awt.image.BufferedImage.TYPE_INT_ARGB)
        map.getRaster().getDataBuffer().getData().fill(java.awt.Color.WHITE.getRGB())
        let graphics = map.createGraphics()

        // Draw each image onto map
        let counter = 0
        for (let x = 0; x < radius * 2; x++) {
            for (let y = 0; y < radius * 2; y++) {
                let image = images[counter]
                counter++

                graphics.drawImage(image, x * 16, y * 16, null)
            }
        }
        ChatLib.chat(`§3[Map§bMaker] §rFinished rendering map in ${java.lang.System.currentTimeMillis() - startTime}ms!`)

        // Save map to maps folder
        javax.imageio.ImageIO.write(map, "png", new java.io.File(`./config/ChatTriggers/modules/MapGenerator/Maps/Map-${new java.io.File("./config/ChatTriggers/modules/MapGenerator/Maps").list().length + 1}.png`))
    
        new TextComponent(`\n§3[Map§bMaker] §rMap complete! Click to open!`)
            .setClick("open_file", `${Client.getMinecraft().field_71412_D}/config/ChatTriggers/modules/MapGenerator/Maps/Map-${new java.io.File("./config/ChatTriggers/modules/MapGenerator/Maps").list().length}.png`)
            .setHover("show_text", `§7§oOpen image?`)
            .chat()
    }).start()
}).setName("mapper")