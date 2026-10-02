package expo.modules.empreintearchive

import expo.modules.empreintearchive.generated.ArchiveKeyMaterial

/** Key material generated at prebuild by `withEmpreinteArchiveKeys` into `generated/`. */
internal class ArchiveKeyMaterialEntry(val version: Int, val masked: IntArray, val mask: IntArray)

internal object ArchiveKeyStore {
  fun key(version: Int): ByteArray? {
    val entry = ArchiveKeyMaterial.entries.firstOrNull { it.version == version } ?: return null
    if (entry.masked.isEmpty() || entry.masked.size != entry.mask.size) return null
    return ByteArray(entry.masked.size) { index -> (entry.masked[index] xor entry.mask[index]).toByte() }
  }
}
