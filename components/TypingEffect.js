import { useTypewriter, Cursor } from 'react-simple-typewriter';

const TypingEffect = () => {
  const [text] = useTypewriter({
      words: [
          'The Digital Remuneration System',
          'Simplifying Your Exam Bill Process',
          'One Tap At a Time'
      ],
      loop: true,
      delaySpeed: 2000,
  });

  return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, fontFamily:"monospace",fontSize:"26px" }}>{text}</p>
          <span style={{ marginLeft: '5px', animation: 'blink 1s step-end infinite' }}>
              <Cursor />
          </span>
      </div>
  );
};

export default TypingEffect;
