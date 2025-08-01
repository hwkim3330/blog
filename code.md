#include <Wire.h>
#include <Adafruit_DotStar.h>

#define I2C_SDA     21
#define I2C_SCL     22
#define LED_CLK_PIN 18
#define LED_DATA_PIN 23
#define TCA_ADDR    0x20
#define NUM_KEYS    16
#define NUM_LEDS    16

Adafruit_DotStar strip(NUM_LEDS, LED_DATA_PIN, LED_CLK_PIN, DOTSTAR_BGR);

enum {
  INPUT_PORT0 = 0x00,
  INPUT_PORT1 = 0x01,
  CONFIG_PORT0 = 0x06,
  CONFIG_PORT1 = 0x07
};

uint16_t readKeys() {
  Wire.beginTransmission(TCA_ADDR);
  Wire.write(INPUT_PORT0);
  Wire.endTransmission();
  Wire.requestFrom(TCA_ADDR, 2);
  uint8_t low  = Wire.read();
  uint8_t high = Wire.read();
  return (high << 8) | low;  // 0 = pressed
}

void setup() {
  Serial.begin(115200);
  Wire.begin(I2C_SDA, I2C_SCL);

  // TCA9555 모든 핀을 입력으로 설정
  Wire.beginTransmission(TCA_ADDR);
  Wire.write(CONFIG_PORT0);
  Wire.write(0xFF);
  Wire.write(0xFF);
  Wire.endTransmission();

  strip.begin();
  strip.clear();
  strip.show();
}

void loop() {
  static uint16_t prev = 0xFFFF;
  uint16_t now = readKeys();

  if (now != prev) {
    for (int i = 0; i < NUM_KEYS; i++) {
      bool pressed = !(now & (1 << i));
      strip.setPixelColor(i, pressed ? strip.Color(0, 80, 180) : 0);
    }
    strip.show();
    prev = now;
  }
  delay(20);
}
