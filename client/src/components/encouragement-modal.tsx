import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EncouragementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const encouragements = [
  {
    emoji: "🎉",
    title: "Excellent travail!",
    message: "You're getting better at French every day!",
  },
  {
    emoji: "⭐",
    title: "Très bien!",
    message: "Your French pronunciation is improving!",
  },
  {
    emoji: "🌟",
    title: "Fantastique!",
    message: "Keep up the great work learning French!",
  },
  {
    emoji: "🎯",
    title: "Parfait!",
    message: "You're becoming a French conversation expert!",
  },
];

export default function EncouragementModal({ isOpen, onClose }: EncouragementModalProps) {
  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="text-6xl mb-4">{randomEncouragement.emoji}</div>
          <DialogTitle className="font-playful text-2xl text-gray-800">
            {randomEncouragement.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            {randomEncouragement.message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="text-2xl">⭐</span>
          <span className="text-2xl">⭐</span>
          <span className="text-2xl">⭐</span>
        </div>
        
        <Button
          onClick={onClose}
          className="bg-kid-green hover:bg-kid-green/90 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
        >
          Continue Learning!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
