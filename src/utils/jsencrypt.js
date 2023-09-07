import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMrqbG5VgT2c8OOwsejmf4nGhjMpLKdX\n' +
  'QUwbOaHr7yzC/FkP9Ej4Rn5R6SKz9NQoUd4oCRmgdKSOjI+UI0IfP9MCAwEAAQ=='

const privateKey =
  'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAyupsblWBPZzw47Cx\n' +
  '6OZ/icaGMyksp1dBTBs5oevvLML8WQ/0SPhGflHpIrP01ChR3igJGaB0pI6Mj5Qj\n' +
  'Qh8/0wIDAQABAkB/fgT82fpnFOmBle5icBioHzUIhhFJXxhm0iBG7W+MRiRQ6mJ4\n' +
  'f5Qm1oLv7RAldd1X3u1hRKvjUXwCTSHbR4vBAiEA5MFc+lCTwX5PvSAcYNpqLLdm\n' +
  'OwVmMHwdo8Ct5Uoly+ECIQDjFTk2fn6QosLHJeLo5CNtsy+3AzLhIF52Gs8QWfvi\n' +
  'MwIgenMLGy7QuO2tL1al+i5QUVlmzscoGWIG16YHL8qOCuECIH35tyyhDgulD5M1\n' +
  'VGVIstLXth+8OYykzWKNytNSaCb7AiEApDxua6IDv9NoNVVKv7uX0l39A8b/FeDe\n' +
  'n8uzZymrNeU='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
