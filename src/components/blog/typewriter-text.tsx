'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface TypewriterTextProps {
  /** Texto único (ou fallback quando phrases não usado) */
  text?: string;
  /** Lista de frases para alternar no loop */
  phrases?: string[];
  /** Velocidade em ms por caractere */
  speed?: number;
  /** Delay antes de começar a digitar */
  startDelay?: number;
  /** Se true, repete a animação em loop */
  loop?: boolean;
  /** Pausa em ms antes de reiniciar (quando loop=true) */
  pauseBeforeRestart?: number;
  /** Classe CSS para o elemento */
  className?: string;
  /** Tag HTML a renderizar */
  as?: 'h1' | 'h2' | 'span' | 'p';
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function TypewriterText({
  text: singleText,
  phrases = [],
  speed = 80,
  startDelay = 0,
  loop = false,
  pauseBeforeRestart = 2000,
  className = '',
  as: Tag = 'h1',
}: TypewriterTextProps) {
  const texts = useMemo(
    () => (phrases.length > 0 ? phrases : singleText ? [singleText] : []),
    [phrases, singleText]
  );
  const currentText = texts[0] ?? '';
  const textsKey = texts.join('|');

  const [displayed, setDisplayed] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && prefersReducedMotion()) {
      const id = requestAnimationFrame(() => setSkipAnimation(true));
      return () => cancelAnimationFrame(id);
    }
  }, []);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phraseIndexRef = useRef(0);

  const fullText = texts[phraseIndex] ?? currentText;
  const effectiveDisplayed = skipAnimation ? fullText : displayed;

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (skipAnimation || texts.length === 0) {
      return; /* Mostra texto completo via effectiveDisplayed */
    }
    if (!started) {
      return; /* Mantém displayed vazio até a digitação começar — evita flash do texto completo */
    }

    const type = (i: number, targetText: string) => {
      if (i <= targetText.length) {
        setDisplayed(targetText.slice(0, i));
        const nextChar = targetText[i];
        const delay = nextChar === '\n' ? speed * 0.5 : speed;
        timeoutRef.current = setTimeout(() => type(i + 1, targetText), delay);
      } else if (loop) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed('');
          const nextIdx = (phraseIndexRef.current + 1) % texts.length;
          phraseIndexRef.current = nextIdx;
          setPhraseIndex(nextIdx);
          type(0, texts[nextIdx]);
        }, pauseBeforeRestart);
      }
    };

    queueMicrotask(() => {
      setDisplayed('');
      setPhraseIndex(0);
    });
    phraseIndexRef.current = 0;
    type(0, texts[0]);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [textsKey, texts, speed, started, skipAnimation, loop, pauseBeforeRestart]);

  const longestText = texts.reduce((a, b) => (a.length >= b.length ? a : b), currentText);
  const isTyping = !skipAnimation && effectiveDisplayed.length < fullText.length;

  return (
    <Tag
      className={cn(className, 'whitespace-pre')}
      style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}
    >
      {/* Espaço predefinido: reserva o bloco (2 linhas) para o texto encaixar sem quebrar o layout */}
      <span aria-hidden className="invisible whitespace-pre col-start-1 row-start-1">
        {longestText}
      </span>
      <span className="col-start-1 row-start-1 min-w-0 whitespace-pre" aria-live="polite">
        {effectiveDisplayed}
        {isTyping && (
          <span
            className="inline-block w-[2px] h-[0.9em] bg-foreground/70 align-middle ml-0.5 animate-pulse"
            style={{ animationDuration: '0.6s' }}
            aria-hidden
          />
        )}
      </span>
    </Tag>
  );
}
