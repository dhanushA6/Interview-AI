from Crypto.Cipher import AES
from base64 import b64encode, b64decode
from os import urandom

# Function to add PKCS7 padding so data length is a multiple of 16 bytes
def pkcs7_pad(data: bytes, block_size: int = 16) -> bytes:
    pad_len = block_size - (len(data) % block_size)
    return data + bytes([pad_len]) * pad_len

# Function to remove the PKCS7 padding after decryption
def pkcs7_unpad(data: bytes) -> bytes:
    pad_len = data[-1]
    if pad_len > 16:
        raise ValueError("Invalid padding.")
    return data[:-pad_len]

# Function to encrypt a plaintext string using AES (CBC mode)
def aes_encrypt(plaintext: str, key: bytes, iv: bytes) -> str:
    # Create a new AES cipher object with CBC mode
    cipher = AES.new(key, AES.MODE_CBC, iv)
    # Encrypt the padded plaintext
    ciphertext = cipher.encrypt(pkcs7_pad(plaintext.encode()))
    # Return the ciphertext encoded in Base64 for easy reading
    return b64encode(ciphertext).decode()

# Function to decrypt a Base64-encoded ciphertext back into plaintext
def aes_decrypt(ciphertext_b64: str, key: bytes, iv: bytes) -> str:
    # Create a new AES cipher for decryption
    decipher = AES.new(key, AES.MODE_CBC, iv)
    # Decode the Base64 ciphertext and decrypt it
    ciphertext = b64decode(ciphertext_b64)
    decrypted = pkcs7_unpad(decipher.decrypt(ciphertext))
    # Return the decrypted text as a normal string
    return decrypted.decode()

# Main part of the program
if __name__ == "__main__":
    # This is the text we want to encrypt
    plaintext = "This is the sample plaintext for AES demonstration. It will be encrypted and decrypted."

    # Generate a random 16-byte (128-bit) key and IV
    key = urandom(16)
    iv = urandom(16)

    # Encrypt the plaintext
    ciphertext_b64 = aes_encrypt(plaintext, key, iv)

    # Decrypt the ciphertext to get back the original plaintext
    decrypted_text = aes_decrypt(ciphertext_b64, key, iv)

    # Print all results in a readable format
    print("AES Key (Base64):", b64encode(key).decode())
    print("IV (Base64):", b64encode(iv).decode())
    print("Ciphertext (Base64):", ciphertext_b64)
    print("Decrypted Plaintext:", decrypted_text)
