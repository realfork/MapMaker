export function colorGrass(image, pos) {
    let color = new java.awt.Color(net.minecraft.world.biome.BiomeColorHelper.func_180286_a(World.getWorld(), pos))

    /*
    let outputImage = new java.awt.image.BufferedImage(image.getWidth(), image.getHeight(), java.awt.image.BufferedImage.TYPE_INT_ARGB)
    let graphics = outputImage.createGraphics()
    graphics.drawImage(image, 0, 0, null)
    graphics.setComposite(java.awt.MultiplyComposite.Multiply)
    graphics.setColor(color)
    graphics.fillRect(0, 0, image.getWidth(), image.getHeight())
    graphics.dispose()
    return outputImage
    */
}