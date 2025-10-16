import { AlertCircle } from "lucide-react";

export default function NoResult () {
    return (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                        Confianza de los resultados menor al 20%
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                        Nuestro modelo arrojó resultados con valores de confianza menores al 20%, por lo que <strong>no podemos asociar el audio a ninguna de las aves</strong> que tenemos en nuestra base de datos.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                            💡 Sugerencias para mejorar los resultados:
                        </p>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Asegúrate de que el audio contenga claramente el canto del ave</li>
                            <li>Reduce el ruido de fondo (viento, tráfico, otras aves)</li>
                            <li>Graba en un ambiente más silencioso</li>
                            <li>Verifica que el ave sea una de las especies que podemos identificar: <strong>Chercán, Zorzal, Chincol o Cachudito</strong></li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
    )
}