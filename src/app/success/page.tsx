"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Aqui você pode verificar o status da transação com a Kirvano
    // e atualizar o banco de dados do usuário
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get("transaction_id");
    
    if (transactionId) {
      // Verificar status da transação
      console.log("Transaction ID:", transactionId);
      // TODO: Implementar verificação de status e atualização do usuário
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Sua compra foi processada com sucesso pela Kirvano
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700">
              ✅ Pagamento aprovado
            </p>
            <p className="text-sm text-gray-700">
              📧 Você receberá um email de confirmação
            </p>
            <p className="text-sm text-gray-700">
              📚 Seus e-books já estão disponíveis
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => router.push("/")}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Meus E-books
            </Button>
            <Button 
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 pt-4">
            Obrigado por comprar na e-booksjá! 🎉
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
