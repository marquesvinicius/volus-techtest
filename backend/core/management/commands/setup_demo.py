"""Comando para preparar o ambiente de demonstração."""

from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management import BaseCommand, call_command

from core.models import Product


class Command(BaseCommand):
    """Prepara base de dados, fixtures e usuário padrão para avaliação."""

    help = (
        "Prepara o ambiente de demonstração aplicando migrações, carregando "
        "fixtures (se necessário) e garantindo um usuário padrão."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default="Volus",
            help="Username do usuário padrão a ser criado/atualizado.",
        )
        parser.add_argument(
            "--password",
            default="volus123",
            help="Senha definida para o usuário padrão.",
        )
        parser.add_argument(
            "--email",
            default="avaliacao@volus.dev",
            help="Email do usuário padrão.",
        )
        parser.add_argument(
            "--skip-migrate",
            action="store_true",
            help="Não executa as migrações do banco.",
        )
        parser.add_argument(
            "--skip-fixtures",
            action="store_true",
            help="Não carrega fixtures de produtos.",
        )

    def handle(self, *args, **options):
        username = options["username"]
        password = options["password"]
        email = options["email"]
        skip_migrate = options["skip_migrate"]
        skip_fixtures = options["skip_fixtures"]

        if skip_migrate:
            self.stdout.write(self.style.WARNING("Pulado: migrações não executadas."))
        else:
            self.stdout.write(self.style.MIGRATE_HEADING("Aplicando migrações"))
            call_command("migrate", interactive=False)

        if skip_fixtures:
            self.stdout.write(self.style.WARNING("Pulado: fixtures não carregadas."))
        else:
            if Product.objects.exists():
                self.stdout.write(
                    self.style.WARNING(
                        "Produtos já existentes detectados. Mantendo dados atuais."
                    )
                )
            else:
                fixture_path = Path("core/fixtures/products.json")
                if fixture_path.exists():
                    self.stdout.write(
                        self.style.NOTICE(
                            f"Importando produtos de {fixture_path.as_posix()}"
                        )
                    )
                    call_command("loaddata", fixture_path.as_posix())
                else:
                    self.stdout.write(
                        self.style.WARNING("Fixture de produtos não encontrada.")
                    )

        user_model = get_user_model()
        user, created = user_model.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": "Vólus",
                "last_name": "Demo",
            },
        )

        user.set_password(password)
        user.email = email
        user.first_name = user.first_name or "Vólus"
        user.last_name = user.last_name or "Demo"
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Usuário padrão '{username}' criado com sucesso."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Usuário '{username}' atualizado com a senha informada."
                )
            )


