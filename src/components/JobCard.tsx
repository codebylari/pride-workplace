import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Clock, Briefcase } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedAt: string;
  tags?: string[];
}

const JobCard = ({ title, company, location, type, description, postedAt, tags }: JobCardProps) => {
  return (
    <Card className="hover:shadow-card transition-smooth hover:scale-[1.02] cursor-pointer border-border/50 backdrop-blur-sm bg-card/80">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              {company}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gradient-primary text-primary-foreground">
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/80 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {postedAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
