const grassCache = new Map()
const leafCache = new Map()

export function colorGrass(image, pos) {
    let color = new java.awt.Color(net.minecraft.world.biome.BiomeColorHelper.func_180286_a(World.getWorld(), pos))

    if (!grassCache.has(color.toString())) {
        let newImage = new java.awt.image.BufferedImage(image.getWidth(), image.getHeight(), java.awt.image.BufferedImage.TYPE_INT_ARGB)
    
        multiply(image, newImage, color)

        grassCache.set(color.toString(), newImage)
        return newImage
    } else return grassCache.get(color.toString())
}

export function colorLeaves(image, pos) {
    let color = new java.awt.Color(net.minecraft.world.biome.BiomeColorHelper.func_180287_b(World.getWorld(), pos))

    if (!leafCache.has(color.toString())) {
        let newImage = new java.awt.image.BufferedImage(image.getWidth(), image.getHeight(), java.awt.image.BufferedImage.TYPE_INT_ARGB)

        multiply(image, newImage, color)

        leafCache.set(color.toString(), newImage)
        return newImage
    } else return leafCache.get(color.toString())
}

function multiply(original, newImage, color) {
    for (let x = 0; x < original.getWidth(); x++) {
        for (let y = 0; y < original.getHeight(); y++) {
            let pixel = original.getRGB(x, y)

            let red = (((pixel >> 16) & 0xff) / 255) * (color.getRed() / 255)
            let green = (((pixel >> 8) & 0xff) / 255) * (color.getGreen() / 255)
            let blue = ((pixel & 0xff) / 255) * (color.getBlue() / 255)
            let alpha = (((pixel >> 24) & 0xff) / 255) * (color.getAlpha() / 255)
            
            let multipliedColor = new java.awt.Color(red, green, blue, alpha)

            newImage.setRGB(x, y, multipliedColor.getRGB())
        }
    }
}