import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import { useGetGreenBallot } from "../../shared/hooks/statistics/useGetGreenBallot";
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

export const NationalListStatistics = ({
    width = 800,
    height = 600,
    marginLeft = 40,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30
}) => {
    const { isLoading, greenBallot, getGreenBallotsApi } = useGetGreenBallot();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Llama a getGreenBallotsApi una vez cuando el componente se monta
        getGreenBallotsApi();
    }, []);

    useEffect(() => {
        if (!isLoading && greenBallot.length > 0) {
            const transformedData = greenBallot.map(item => ({
                id: item.greenTeam._id,
                label: item.greenTeam.partie.name,
                votos: item.count,
                color: item.greenTeam.partie.colorHex,
                acronym: item.greenTeam.partie.acronym
            }));
            setData(transformedData);
        }
    }, [isLoading, greenBallot]);

    useEffect(() => {
        // Conectar al servidor de sockets
        const socket = io(import.meta.env.REACT_APP_SOCKET_URL, {
            withCredentials: false,
        });

        // Escuchar el evento de conexión
        socket.on('connect', () => {
            console.log('Conectado al servidor de sockets');
        });

        // Suscribirse al evento de nueva papeleta verde
        socket.on('newGreenBallot', (newData) => {
            console.log('Nueva papeleta verde', newData);

            setData((prevData) => {
                const updateData = [...prevData];

                const existingTeamIndex = updateData.findIndex(item => {
                    return item.id == newData.greenTeam.idTeam;
                });

                if (existingTeamIndex !== -1) {
                    updateData[existingTeamIndex].value = newData.count;
                } else {
                    updateData.push({
                        id: newData.greenTeam.idTeam,
                        label: newData.greenTeam.name,
                        votos: newData.count,
                        color: newData.greenTeam.colorHex,
                        acronym: newData.greenTeam.acronym
                    });
                }
                return updateData;
            });
        });

        // Manejar la desconexión
        socket.on('disconnect', () => {
            console.log('Desconectado del servidor de sockets');
        });
    }, []);

    return (
        isLoading ? (
            <p>Cargando...</p>
        ) : (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: marginTop, right: marginRight, left: marginLeft, bottom: marginBottom }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="acronym" tick={{fill: 'black', fontWeight: 'bold'}} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votos">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    );
};

