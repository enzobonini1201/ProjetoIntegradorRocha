package com.example.sistema_rocha_mobile

import android.content.Context
import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.spec.GCMParameterSpec

class MainActivity : FlutterActivity() {
    private val channelName = "com.sistemarocha.mobile/secure_storage"
    private val keyAlias = "SistemaRochaStorageKey"
    private val preferencesName = "sistema_rocha_secure_storage"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, channelName)
            .setMethodCallHandler { call, result ->
                val key = call.argument<String>("key")
                if (key.isNullOrBlank()) {
                    result.error("INVALID_KEY", "A chave do armazenamento é obrigatória.", null)
                    return@setMethodCallHandler
                }

                try {
                    when (call.method) {
                        "read" -> result.success(readValue(key))
                        "write" -> {
                            val value = call.argument<String>("value")
                            if (value == null) {
                                result.error("INVALID_VALUE", "O valor do armazenamento é obrigatório.", null)
                            } else {
                                writeValue(key, value)
                                result.success(null)
                            }
                        }
                        "delete" -> {
                            deleteValue(key)
                            result.success(null)
                        }
                        else -> result.notImplemented()
                    }
                } catch (exception: Exception) {
                    result.error("SECURE_STORAGE_ERROR", exception.message, null)
                }
            }
    }

    private fun preferences() = getSharedPreferences(preferencesName, Context.MODE_PRIVATE)

    private fun readValue(key: String): String? {
        val encoded = preferences().getString(key, null) ?: return null
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return encoded
        }

        val parts = encoded.split(":", limit = 2)
        if (parts.size != 2) return null

        val iv = Base64.decode(parts[0], Base64.NO_WRAP)
        val encrypted = Base64.decode(parts[1], Base64.NO_WRAP)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), GCMParameterSpec(128, iv))
        return String(cipher.doFinal(encrypted), StandardCharsets.UTF_8)
    }

    private fun writeValue(key: String, value: String) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            preferences().edit().putString(key, value).apply()
            return
        }

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, getSecretKey())
        val iv = Base64.encodeToString(cipher.iv, Base64.NO_WRAP)
        val encrypted = Base64.encodeToString(
            cipher.doFinal(value.toByteArray(StandardCharsets.UTF_8)),
            Base64.NO_WRAP,
        )
        preferences().edit().putString(key, "$iv:$encrypted").apply()
    }

    private fun deleteValue(key: String) {
        preferences().edit().remove(key).apply()
    }

    private fun getSecretKey(): javax.crypto.SecretKey {
        val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        val existingKey = keyStore.getKey(keyAlias, null)
        if (existingKey is javax.crypto.SecretKey) return existingKey

        val generator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore",
        )
        generator.init(
            KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build(),
        )
        return generator.generateKey()
    }
}
