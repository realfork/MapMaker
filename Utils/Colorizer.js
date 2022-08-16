// add color caching for more speeds

export function colorGrass(image, pos) {
    let color = new java.awt.Color(net.minecraft.world.biome.BiomeColorHelper.func_180286_a(World.getWorld(), pos))
    let newImage = new java.awt.image.BufferedImage(image.getWidth(), image.getHeight(), java.awt.image.BufferedImage.TYPE_INT_ARGB)

    multiply(image, newImage, color)
    return newImage
}

export function colorLeaves(image, pos) {
    let color = new java.awt.Color(net.minecraft.world.biome.BiomeColorHelper.func_180287_b(World.getWorld(), pos))
    let newImage = new java.awt.image.BufferedImage(image.getWidth(), image.getHeight(), java.awt.image.BufferedImage.TYPE_INT_ARGB)

    multiply(image, newImage, color)
    return newImage
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