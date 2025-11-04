"""
Locust load testing for LinKar platform
Run with: locust -f locustfile.py --host=https://nvtgmcqromdzmrapbkrg.supabase.co
"""

from locust import HttpUser, task, between, events
import json
import random

# Supabase configuration
SUPABASE_URL = "https://nvtgmcqromdzmrapbkrg.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dGdtY3Fyb21kem1yYXBia3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjQzNjcsImV4cCI6MjA3NTQ0MDM2N30.dYujxM4JLR31x1uq67b7wz7KCYQxUWZj0f35tT6w_DY"


class CandidateUser(HttpUser):
    """Simula comportamento de candidatos na plataforma"""
    wait_time = between(1, 3)
    
    def on_start(self):
        """Setup inicial - auth headers"""
        self.headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        self.access_token = None
    
    @task(3)
    def list_jobs(self):
        """Lista vagas disponíveis"""
        response = self.client.get(
            "/rest/v1/jobs?select=*,company_profiles(fantasy_name,logo_url)&order=created_at.desc&limit=20",
            headers=self.headers,
            name="GET /jobs"
        )
        if response.status_code == 200:
            self.jobs = response.json()
    
    @task(2)
    def view_job_details(self):
        """Visualiza detalhes de uma vaga"""
        if hasattr(self, 'jobs') and self.jobs:
            job_id = random.choice(self.jobs).get('id')
            self.client.get(
                f"/rest/v1/jobs?id=eq.{job_id}&select=*,company_profiles(*)",
                headers=self.headers,
                name="GET /job-details"
            )
    
    @task(1)
    def search_jobs(self):
        """Busca vagas com filtro"""
        search_terms = ["desenvolvedor", "designer", "marketing", "vendas"]
        term = random.choice(search_terms)
        self.client.get(
            f"/rest/v1/jobs?or=(title.ilike.%25{term}%25,description.ilike.%25{term}%25)&limit=20",
            headers=self.headers,
            name="GET /search-jobs"
        )
    
    @task(1)
    def list_profiles(self):
        """Lista perfis de candidatos"""
        self.client.get(
            "/rest/v1/profiles?select=*&limit=20",
            headers=self.headers,
            name="GET /profiles"
        )


class CompanyUser(HttpUser):
    """Simula comportamento de empresas na plataforma"""
    wait_time = between(2, 5)
    
    def on_start(self):
        """Setup inicial - auth headers"""
        self.headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    @task(3)
    def list_candidates(self):
        """Lista candidatos disponíveis"""
        self.client.get(
            "/rest/v1/profiles?select=*&limit=20",
            headers=self.headers,
            name="GET /candidates"
        )
    
    @task(2)
    def view_company_jobs(self):
        """Visualiza vagas da empresa"""
        self.client.get(
            "/rest/v1/jobs?select=*&order=created_at.desc&limit=10",
            headers=self.headers,
            name="GET /company-jobs"
        )
    
    @task(1)
    def view_applications(self):
        """Visualiza candidaturas recebidas"""
        self.client.get(
            "/rest/v1/applications?select=*,profiles(*),jobs(*)&limit=20",
            headers=self.headers,
            name="GET /applications"
        )
    
    @task(1)
    def view_matches(self):
        """Visualiza matches"""
        self.client.get(
            "/rest/v1/matches?select=*,profiles(*),jobs(*)&limit=20",
            headers=self.headers,
            name="GET /matches"
        )


class AuthUser(HttpUser):
    """Testa operações de autenticação"""
    wait_time = between(5, 10)
    
    def on_start(self):
        """Setup inicial"""
        self.headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json"
        }
    
    @task(1)
    def signup_candidate(self):
        """Simula registro de candidato"""
        email = f"candidate_{random.randint(1000, 9999)}@loadtest.com"
        payload = {
            "email": email,
            "password": "TestPassword123!",
            "data": {
                "role": "candidate",
                "full_name": f"Candidate Test {random.randint(1, 1000)}"
            }
        }
        self.client.post(
            "/auth/v1/signup",
            json=payload,
            headers=self.headers,
            name="POST /auth/signup"
        )
    
    @task(1)
    def signup_company(self):
        """Simula registro de empresa"""
        email = f"company_{random.randint(1000, 9999)}@loadtest.com"
        payload = {
            "email": email,
            "password": "TestPassword123!",
            "data": {
                "role": "company",
                "full_name": f"Company Test {random.randint(1, 1000)}"
            }
        }
        self.client.post(
            "/auth/v1/signup",
            json=payload,
            headers=self.headers,
            name="POST /auth/signup-company"
        )


class NotificationUser(HttpUser):
    """Testa sistema de notificações"""
    wait_time = between(3, 6)
    
    def on_start(self):
        """Setup inicial"""
        self.headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
    
    @task(5)
    def list_notifications(self):
        """Lista notificações"""
        self.client.get(
            "/rest/v1/notifications?select=*&order=created_at.desc&limit=20",
            headers=self.headers,
            name="GET /notifications"
        )
    
    @task(1)
    def count_unread(self):
        """Conta notificações não lidas"""
        self.client.get(
            "/rest/v1/notifications?select=count&read=eq.false",
            headers=self.headers,
            name="GET /notifications/unread-count"
        )


@events.init_command_line_parser.add_listener
def _(parser):
    """Adiciona argumentos customizados"""
    parser.add_argument("--scenario", type=str, default="all", help="Cenário de teste: all, candidate, company, auth")


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Executado quando o teste inicia"""
    print(f"🚀 Iniciando testes de carga no LinKar")
    print(f"🎯 Target: {SUPABASE_URL}")
