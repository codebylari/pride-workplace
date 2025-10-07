import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar vagas, empresas ou palavras-chave..."
            className="pl-10 h-12 bg-card/80 backdrop-blur-sm border-border/50"
          />
        </div>
        <Button className="h-12 px-8 gradient-primary shadow-glow hover:opacity-90 transition-smooth">
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
