import type { QuestBoard, QuestKind } from '../types.ts'

export function createQuestBoard(dayKey: string): QuestBoard {
  const day = Number(dayKey.slice(-2)) || 1
  const sessionTarget = day % 3 === 0 ? 3 : 2
  return {
    dayKey,
    list: [
      {
        id: 'sessions',
        kind: 'sessions',
        target: sessionTarget,
        progress: 0,
        claimed: false,
        reward: 15,
      },
      {
        id: 'minutes',
        kind: 'minutes',
        target: sessionTarget * 25,
        progress: 0,
        claimed: false,
        reward: 20,
      },
      {
        id: 'care',
        kind: 'care',
        target: 3,
        progress: 0,
        claimed: false,
        reward: 10,
      },
    ],
  }
}

export function progressQuests(
  board: QuestBoard,
  kind: QuestKind,
  amount: number,
): QuestBoard {
  return {
    ...board,
    list: board.list.map((quest) =>
      quest.kind === kind
        ? {
            ...quest,
            progress: Math.min(quest.target, quest.progress + amount),
          }
        : quest,
    ),
  }
}
