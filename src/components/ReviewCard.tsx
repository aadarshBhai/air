import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const ReviewCard = ({ name, rating, comment, avatar }: ReviewCardProps) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-primary font-bold">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? "fill-accent text-accent" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
