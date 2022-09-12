import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Voice from '@react-native-voice/voice'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';



const COLORS_NUMBERS = [0, 1, 2]
const COLORS = ['blue', 'red', 'yellow']

export default function App() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const color = useSharedValue(0);
  const radius = useSharedValue(0);

  const resumeRecognizeVoice = async () => {
    const isRecognizing = await Voice.isRecognizing()
    if (isRecognizing) {
      await Voice.stop()
    } else {
      await Voice.start('pt-BR')
    }
  }


  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const result = e.value;
      const identifiedDirection = result[0].toLocaleLowerCase().split(' ').at(-1);
      console.log(identifiedDirection)



      

      if (identifiedDirection.includes('quadrado')) {
        radius.value = withTiming(0);
      }

      if (identifiedDirection.includes('redondo')) {
        radius.value = withTiming(50);
      }

      if (identifiedDirection.includes('azul')) {
        color.value = withTiming(0);
      }
      if (identifiedDirection.includes('vermelho')) {
        color.value = withTiming(1);
      }
      if (identifiedDirection.includes('amarelo')) {
        color.value = withTiming(2);
      }

      if (identifiedDirection.includes('cima')) {
        y.value = withTiming(y.value - 100)
      }
      if (identifiedDirection.includes('direita')) {
        x.value = withTiming(x.value + 100)
      }
      if (identifiedDirection.includes('baixo')) {
        y.value = withTiming(y.value + 100)
      }
      if (identifiedDirection.includes('esquerda')) {
        x.value = withTiming(x.value - 100)
      }

      if (identifiedDirection.includes('parar')) {
        Voice.stop()
      }
    }
    Voice.onSpeechError = (e) => {
      console.log('erro', e)
    }
  }, [])

  const rStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: x.value },
        { translateY: y.value }
      ],
      backgroundColor: interpolateColor(color.value, COLORS_NUMBERS, COLORS),
      borderRadius: radius.value,
    }), [])

  return (
    <View style={styles.container}>
      <Text onPress={resumeRecognizeVoice}>reconhecer voz </Text>
      <Animated.View style={[styles.box, rStyle]}  /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
  }
});
