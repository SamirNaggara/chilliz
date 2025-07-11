import { getUsers, getJerseys } from "@/lib/actions";
import { CreateUserForm } from "@/components/CreateUserForm";
import { CreateJerseyForm } from "@/components/CreateJerseyForm";
import { CreateScanForm } from "@/components/CreateScanForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const usersResult = await getUsers();
  const jerseysResult = await getJerseys();

  const users =
    usersResult.success && usersResult.users ? usersResult.users : [];
  const jerseys =
    jerseysResult.success && jerseysResult.jerseys ? jerseysResult.jerseys : [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🏆 POC Chilliz - Gestion des Maillots
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Formulaire de création d'utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Créer un utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>

        {/* Formulaire de création de maillot */}
        <Card>
          <CardHeader>
            <CardTitle>Créer un maillot</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateJerseyForm />
          </CardContent>
        </Card>

        {/* Formulaire de création de scan */}
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer un scan</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateScanForm users={users} jerseys={jerseys} />
          </CardContent>
        </Card>
      </div>

      {/* Affichage des données */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {usersResult.success ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="p-3 border rounded">
                    <p className="font-medium">Wallet: {user.wallet}</p>
                    <p className="text-sm text-gray-600">
                      Scans: {user.scans.length} | Créé:{" "}
                      {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500">{usersResult.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Liste des maillots */}
        <Card>
          <CardHeader>
            <CardTitle>Maillots ({jerseys.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {jerseysResult.success ? (
              <div className="space-y-2">
                {jerseys.map((jersey) => (
                  <div
                    key={jersey.id}
                    className="p-3 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">ID: {jersey.id}</p>
                        <p className="text-sm">Nom: {jersey.name}</p>
                        <p className="text-sm text-gray-600">
                          Scans: {jersey.scans.length} | Créé:{" "}
                          {jersey.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/jersey/${jersey.id}`}>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500">{jerseysResult.error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
