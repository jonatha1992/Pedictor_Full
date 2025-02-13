from .models import Game
from rest_framework import serializers
from .models import User, Report, License, UserLicense


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id_user', 'name', 'email', 'password', 'created_at', 'license_info')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)

        # Si se proporciona una nueva contraseña, actualizarla de forma segura
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = ['id_license', 'key', 'date_expiration']

    def create(self, validated_data):
        # Crear una nueva licencia
        return License.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Actualizar una licencia existente
        instance.key = validated_data.get('key', instance.key)
        instance.date_expiration = validated_data.get('date_expiration', instance.date_expiration)
        instance.save()
        return instance


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class HistoryItemSerializer(serializers.Serializer):
    numero = serializers.IntegerField()
    probabilidad = serializers.FloatField()
    repetido = serializers.IntegerField()


class NumeroJugarSerializer(serializers.Serializer):
    numero = serializers.IntegerField()
    probabilidad = serializers.FloatField()
    repetido = serializers.IntegerField()
    tardancia = serializers.IntegerField()
    vecinos = serializers.IntegerField()


class GameSerializer(serializers.Serializer):
    cantidad_vecinos = serializers.IntegerField(required=False, default=4)
    limite_tardancia = serializers.IntegerField(required=False, default=10)
    umbral_probabilidad = serializers.IntegerField(required=False, default=20)
    # agregar otros campos según necesidad


class PredictSerializer(serializers.Serializer):
    number_before = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Lista de 10 números (entrada para la predicción)"
    )
    history = HistoryItemSerializer(
        many=True,
        help_text="Historial con número, probabilidad acumulada y repetidos"
    )
    jugados = NumeroJugarSerializer(
        many=True,
        required=False,
        help_text="Números a jugar con sus respectivas propiedades"
    )
    game = GameSerializer()
