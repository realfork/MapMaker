/// <reference types="../CTAutocomplete" />
import Async from "Async"
import { colorGrass, colorLeaves } from "./Utils/Colorizer"

import { scanSurface } from "./Utils/Scanner"
import { getTexture, whiteTile } from "./Utils/TextureGrabber"

register("command", (...args) => {
    if (!args || parseInt(args[0]) == null) return ChatLib.chat("§3[Map§bMaker] §rPlease specify a radius for your map! (Number of blocks in each direction)")
    if (parseInt(args[0]) >= 256) ChatLib.chat("§3[Map§bMaker] §rDISCLAIMER: Radii over this amount require high RAM allocation. You may need to allocate more RAM then restart your game.")
    
    const radius = parseInt(args[0])

    Async.run(() => {
        let blocks = scanSurface(radius)

        // Turn all positions into images
        ChatLib.chat("\n§3[Map§bMaker] §rBeginning image and foliage processing!")
        let trueStartTime = java.lang.System.currentTimeMillis()
        let startTime = java.lang.System.currentTimeMillis()

        let images = []
        blocks.forEach(pos => {
            let image = new java.awt.image.BufferedImage(16, 16, java.awt.image.BufferedImage.TYPE_INT_ARGB)

            if (pos != null) {
                let block = World.getBlockAt(pos)
                image = getTexture(block)

                let bugFixer = new java.awt.image.BufferedImage(16, 16, java.awt.image.BufferedImage.TYPE_INT_ARGB)

                // Grass and Leaf coloring
                if (block.type.getRegistryName() == "minecraft:grass") bugFixer.createGraphics().drawImage(colorGrass(image, block.pos.toMCBlock()), 0, 0, null)
                else if (block.type.getRegistryName().includes("leaves")) bugFixer.createGraphics().drawImage(colorLeaves(image, block.pos.toMCBlock()), 0, 0, null)
                else bugFixer.createGraphics().drawImage(image, 0, 0, null)

                // Foliage
                if (block.type.getRegistryName().includes("leaves") || block.type.getRegistryName() == "minecraft:water") {
                    for (let y = pos.y; y > 0; y--) {
                        let underBlock = World.getBlockAt(pos.x, y, pos.z)
    
                        if (underBlock.type.mcBlock.func_149730_j() && !underBlock.type.getRegistryName().includes("leaves")) {
                            let bugFixer2 = new java.awt.image.BufferedImage(16, 16, java.awt.image.BufferedImage.TYPE_INT_ARGB)
                            let underlayImage = getTexture(underBlock)

                            // Coloring
                            if (underBlock.type.getRegistryName() == "minecraft:grass") bugFixer2.createGraphics().drawImage(colorGrass(underlayImage, underBlock.pos.toMCBlock()), 0, 0, null)
                            else bugFixer2.createGraphics().drawImage(underlayImage, 0, 0, null)
                            
                            bugFixer2.createGraphics().drawImage(bugFixer, 0, 0, null)
                            bugFixer = bugFixer2
                            break
                        }
                    }
                }
                image = bugFixer
            // Makes air white
            } else image = whiteTile

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

                // Update status
                displayCompletion(Math.floor((counter / images.length) * 100).toString(), Math.floor((java.lang.System.currentTimeMillis() - trueStartTime) / 1000).toString())
            }
        }

        // Save map to maps folder
        javax.imageio.ImageIO.write(map, "png", new java.io.File(`./config/ChatTriggers/modules/MapGenerator/Maps/Map-${new java.io.File("./config/ChatTriggers/modules/MapGenerator/Maps").list().length + 1}.png`))
    
        new TextComponent(`\n§3[Map§bMaker] §rMap complete! Click to open!`)
            .setClick("open_file", `${Client.getMinecraft().field_71412_D}/config/ChatTriggers/modules/MapGenerator/Maps/Map-${new java.io.File("./config/ChatTriggers/modules/MapGenerator/Maps").list().length}.png`)
            .setHover("show_text", `§7§oOpen image?`)
            .chat()
    })
}).setName("mapper")

let percentage
let timeElapsed
let running = false
function displayCompletion(percent, time) {
    percentage = percent, timeElapsed = time
    running = true
}

register("step", () => {
    if (running) new Message(`§3[Map§bMaker] &a${percentage}% complete. Total Time Elapsed: ${timeElapsed}s`).setChatLineId(765224).chat()
    if (percentage == "100") running = false
}).setFps(30)