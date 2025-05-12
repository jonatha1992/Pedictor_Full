from dataclasses import dataclass
from functools import wraps
import logging


def modificar_tardanza(fn):
    @wraps(fn)
    def wrapper(self, *args, **kwargs):
        resultado = fn(self, *args, **kwargs)
        if self.tardancia > 0:
            self.tardancia -= 1
            logging.debug(f"Tardanza de número {self.numero} reducida a {self.tardancia}")
        return resultado
    return wrapper


@dataclass
class NumeroBase:
    numero: int
    probabilidad: float

    def actualizar_probabilidad(self, nueva_probabilidad: float):
        """Actualiza la probabilidad"""
        self.probabilidad += nueva_probabilidad

    def __str__(self):
        return f"(N:{self.numero}, P:{self.probabilidad})"


@dataclass
class NumeroJugar(NumeroBase):
    vecinos: int = 1
    tardancia: int = 1

    def actualizar_probabilidad(self, nueva_probabilidad: float):
        """Actualiza probabilidad y modifica tardancia"""
        super().actualizar_probabilidad(nueva_probabilidad)

    def jugar(self):
        """Incrementa la tardancia"""
        self.tardancia += 1

    def __str__(self):
        return f"(N:{self.numero}, P:{self.probabilidad}, T:{self.tardancia})"


@dataclass
class NumeroHistorial(NumeroBase):
    pass
