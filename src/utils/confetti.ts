import confetti from 'canvas-confetti';

export const triggerChampagneSparkles = (originX = 0.5, originY = 0.5) => {
  confetti({
    particleCount: 36,
    spread: 60,
    startVelocity: 25,
    origin: { x: originX, y: originY },
    colors: ['#C5A77D', '#292722', '#48443C', '#E5D9C9', '#F1ECE3'],
    ticks: 120,
    gravity: 0.8,
    scalar: 0.9,
    shapes: ['circle'],
    disableForReducedMotion: true,
  });
};

export const triggerBookingSuccessCelebration = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      particleCount,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors: ['#C5A77D', '#292722', '#48443C', '#E5D9C9', '#F1ECE3'],
    });
    confetti({
      particleCount,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors: ['#C5A77D', '#292722', '#48443C', '#E5D9C9', '#F1ECE3'],
    });
  }, 350);
};
