"use client";

import { useState } from "react";
import { BookOpen, Sparkles, ShoppingCart, Plus, Search, Filter, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EBOOKS_DATA, CATEGORIES, type Ebook } from "@/lib/ebooks-data";

type User = {
  hasAccess: boolean;
  purchasedEbooks: number[];
};

export default function Home() {
  const [user, setUser] = useState<User>({ hasAccess: false, purchasedEbooks: [] });
  const [ebooks, setEbooks] = useState<Ebook[]>(EBOOKS_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [cart, setCart] = useState<number[]>([]);

  // Filtrar e-books
  const filteredEbooks = ebooks.filter((ebook) => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorias únicas
  const categories = ["all", ...CATEGORIES];

  // Comprar acesso
  const handleBuyAccess = () => {
    setUser({ ...user, hasAccess: true });
    setShowAccessDialog(false);
  };

  // Adicionar ao carrinho
  const addToCart = (ebookId: number) => {
    if (!cart.includes(ebookId)) {
      setCart([...cart, ebookId]);
    }
  };

  // Remover do carrinho
  const removeFromCart = (ebookId: number) => {
    setCart(cart.filter((id) => id !== ebookId));
  };

  // Finalizar compra
  const handleCheckout = () => {
    const newPurchased = [...user.purchasedEbooks, ...cart];
    setUser({ ...user, purchasedEbooks: newPurchased });
    setEbooks(ebooks.map((ebook) => 
      cart.includes(ebook.id) ? { ...ebook, purchased: true } : ebook
    ));
    setCart([]);
  };

  // Criar novo e-book
  const handleCreateEbook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEbook: Ebook = {
      id: ebooks.length + 1,
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
      description: formData.get("description") as string,
      pages: parseInt(formData.get("pages") as string),
      price: 4.99,
      purchased: false,
    };
    setEbooks([...ebooks, newEbook]);
    setShowCreateDialog(false);
  };

  const totalCart = cart.length * 4.99;

  // Contagem por categoria
  const categoryCount = (cat: string) => {
    if (cat === "all") return ebooks.length;
    return ebooks.filter(e => e.category === cat).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                e-booksjá
              </h1>
              <Badge className="bg-green-600 text-white">
                {ebooks.length} e-books
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              {!user.hasAccess ? (
                <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Obter Acesso - R$ 19,99
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Obter Acesso à Plataforma</DialogTitle>
                      <DialogDescription>
                        Pague apenas R$ 19,99 uma única vez e tenha acesso a {ebooks.length} e-books. 
                        Depois, compre e-books individuais por apenas R$ 4,99 cada.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Acesso vitalício à plataforma</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>{ebooks.length} e-books disponíveis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>E-books por apenas R$ 4,99</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Crie seus próprios e-books</span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleBuyAccess} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Pagar R$ 19,99 e Começar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar E-book
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Criar Novo E-book</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do seu e-book
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateEbook}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" placeholder="Digite o título do e-book" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="author">Autor</Label>
                            <Input id="author" name="author" placeholder="Nome do autor" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select name="category" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pages">Número de Páginas</Label>
                            <Input id="pages" name="pages" type="number" placeholder="Ex: 250" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea 
                              id="description" 
                              name="description" 
                              placeholder="Descreva o conteúdo do e-book" 
                              rows={4}
                              required 
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Criar E-book
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="relative">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Carrinho
                        {cart.length > 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                            {cart.length}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Carrinho de Compras</DialogTitle>
                        <DialogDescription>
                          {cart.length === 0 ? "Seu carrinho está vazio" : `${cart.length} e-book(s) no carrinho`}
                        </DialogDescription>
                      </DialogHeader>
                      {cart.length > 0 && (
                        <div className="space-y-4">
                          {cart.map((ebookId) => {
                            const ebook = ebooks.find((e) => e.id === ebookId);
                            if (!ebook) return null;
                            return (
                              <div key={ebookId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{ebook.title}</p>
                                  <p className="text-sm text-gray-600">R$ 4,99</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeFromCart(ebookId)}
                                >
                                  Remover
                                </Button>
                              </div>
                            );
                          })}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-bold text-lg">Total:</span>
                              <span className="font-bold text-lg text-purple-600">
                                R$ {totalCart.toFixed(2)}
                              </span>
                            </div>
                            <Button 
                              onClick={handleCheckout}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                              Finalizar Compra
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!user.hasAccess && (
        <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {ebooks.length} E-books ao Seu Alcance
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Acesso único de R$ 19,99 + R$ 4,99 por e-book. Crie, compre e venda seus próprios e-books!
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                50 E-books de Programação
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                40 E-books de Marketing
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                35 E-books de Finanças
              </Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                30 E-books de Design
              </Badge>
              <Badge variant="outline" className="text-pink-600 border-pink-600">
                30 E-books de Desenvolvimento Pessoal
              </Badge>
              <Badge variant="outline" className="text-indigo-600 border-indigo-600">
                25 E-books de Produtividade
              </Badge>
            </div>
            <Button 
              size="lg"
              onClick={() => setShowAccessDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Agora - R$ 19,99
            </Button>
          </div>
        </section>
      )}

      {/* Filtros e Busca */}
      {user.hasAccess && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar e-books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "Todas" : cat} ({categoryCount(cat)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-center text-gray-600 mb-4">
            Mostrando {filteredEbooks.length} de {ebooks.length} e-books
          </p>
        </section>
      )}

      {/* Grid de E-books */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEbooks.map((ebook) => (
            <Card key={ebook.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={ebook.cover} 
                  alt={ebook.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-purple-600 text-white">
                  {ebook.category}
                </Badge>
                {ebook.purchased && (
                  <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Comprado
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{ebook.title}</CardTitle>
                <CardDescription>{ebook.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {ebook.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{ebook.pages} páginas</span>
                  <span className="font-bold text-purple-600 text-lg">R$ {ebook.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                {!user.hasAccess ? (
                  <Button 
                    className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                    disabled
                  >
                    Obtenha Acesso Primeiro
                  </Button>
                ) : ebook.purchased ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ler Agora
                  </Button>
                ) : cart.includes(ebook.id) ? (
                  <Button 
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600"
                    onClick={() => removeFromCart(ebook.id)}
                  >
                    Remover do Carrinho
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => addToCart(ebook.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredEbooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum e-book encontrado</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6" />
            <span className="text-xl font-bold">e-booksjá</span>
          </div>
          <p className="text-gray-400 mb-2">
            Sua plataforma completa para criação e venda de e-books
          </p>
          <p className="text-sm text-gray-500">
            {ebooks.length} e-books disponíveis em 6 categorias
          </p>
        </div>
      </footer>
    </div>
  );
}
