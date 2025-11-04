from locust import HttpUser, task, between
import random

class LinkaUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        """Executado quando um usuário inicia"""
        self.headers = {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dGdtY3Fyb21kem1yYXBia3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjQzNjcsImV4cCI6MjA3NTQ0MDM2N30.dYujxM4JLR31x1uq67b7wz7KCYQxUWZj0f35tT6w_DY",
            "Content-Type": "application/json"
        }
        self.base_url = "https://nvtgmcqromdzmrapbkrg.supabase.co"
    
    @task(3)
    def view_jobs(self):
        """Visualizar lista de vagas"""
        with self.client.get(
            f"{self.base_url}/rest/v1/jobs?select=*",
            headers=self.headers,
            catch_response=True,
            name="GET /jobs"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(2)
    def view_candidates(self):
        """Visualizar lista de candidatos"""
        with self.client.get(
            f"{self.base_url}/rest/v1/profiles?select=*",
            headers=self.headers,
            catch_response=True,
            name="GET /candidates"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(2)
    def view_company_jobs(self):
        """Visualizar vagas de empresas"""
        with self.client.get(
            f"{self.base_url}/rest/v1/company_profiles?select=*",
            headers=self.headers,
            catch_response=True,
            name="GET /company-jobs"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(1)
    def view_applications(self):
        """Visualizar candidaturas"""
        with self.client.get(
            f"{self.base_url}/rest/v1/applications?select=*",
            headers=self.headers,
            catch_response=True,
            name="GET /applications"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(1)
    def view_matches(self):
        """Visualizar matches"""
        with self.client.get(
            f"{self.base_url}/rest/v1/matches?select=*",
            headers=self.headers,
            catch_response=True,
            name="GET /matches"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(2)
    def view_notifications(self):
        """Visualizar notificações"""
        with self.client.get(
            f"{self.base_url}/rest/v1/notifications?select=*&limit=10",
            headers=self.headers,
            catch_response=True,
            name="GET /notifications"
        ) as response:
            if response.status_code == 200 or response.status_code == 401:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(1)
    def view_notifications_count(self):
        """Visualizar contagem de notificações não lidas"""
        with self.client.get(
            f"{self.base_url}/rest/v1/notifications?select=count&read=eq.false",
            headers=self.headers,
            catch_response=True,
            name="GET /notifications/unread-count"
        ) as response:
            if response.status_code == 200 or response.status_code == 401:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(1)
    def search_jobs(self):
        """Buscar vagas"""
        search_term = random.choice(["desenvolvedor", "design", "marketing", "vendas"])
        with self.client.get(
            f"{self.base_url}/rest/v1/jobs?title=ilike.*{search_term}*",
            headers=self.headers,
            catch_response=True,
            name="GET /search-jobs"
        ) as response:
            if response.status_code == 200 or response.status_code == 401:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(1)
    def signup_candidate(self):
        """Tentar cadastro de candidato (vai falhar - teste de carga apenas)"""
        email = f"test_{random.randint(1000, 9999)}@example.com"
        with self.client.post(
            f"{self.base_url}/auth/v1/signup",
            headers=self.headers,
            json={
                "email": email,
                "password": "Test@123456",
                "data": {
                    "role": "candidate",
                    "full_name": "Test User"
                }
            },
            catch_response=True,
            name="POST /auth/signup"
        ) as response:
            # Esperamos falha pois são emails de teste
            if response.status_code in [200, 400, 422]:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
    
    @task(1)
    def signup_company(self):
        """Tentar cadastro de empresa (vai falhar - teste de carga apenas)"""
        email = f"company_{random.randint(1000, 9999)}@example.com"
        with self.client.post(
            f"{self.base_url}/auth/v1/signup",
            headers=self.headers,
            json={
                "email": email,
                "password": "Test@123456",
                "data": {
                    "role": "company",
                    "fantasy_name": "Test Company"
                }
            },
            catch_response=True,
            name="POST /auth/signup-company"
        ) as response:
            # Esperamos falha pois são emails de teste
            if response.status_code in [200, 400, 422]:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
