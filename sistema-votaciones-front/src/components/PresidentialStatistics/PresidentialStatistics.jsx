import React, { useEffect, useState } from "react";
import { useGetWhiteBallot } from "../../shared/hooks/statistics/useGetWhiteBallot";
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

export const PresidentialStatistics = ({
    width = 800,
    height = 600,
    marginLeft = 40,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30
}) => {
    const { isLoading, whiteBallot, getWhiteBallotsApi } = useGetWhiteBallot();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Llama a getWhiteBallotsApi una vez cuando el componente se monta
        getWhiteBallotsApi();
    }, []);

    useEffect(() => {
        if (!isLoading && whiteBallot.length > 0) {
            const transformedData = whiteBallot.map(item => ({
                id: item.whiteTeam._id,
                name: item.whiteTeam.partie.name,
                votos: item.count,
                color: item.whiteTeam.partie.colorHex,
                acronym: item.whiteTeam.partie.acronym
            }));
            setData(transformedData);
        }
    }, [isLoading, whiteBallot]);

    useEffect(() => {
        // Conectar al servidor de sockets
        const socket = io(import.meta.env.REACT_APP_SOCKET_URL, {
            withCredentials: false,
        });

        // Escuchar el evento de conexión
        socket.on('connect', () => {
            console.log('Conectado al servidor de sockets');
        });

        // Suscribirse al evento de nueva papeleta blanca
        socket.on('newWhiteBallot', (newData) => {
            console.log('Nueva papeleta blanca', newData);

            setData((prevData) => {
                const updateData = [...prevData];

                const existingTeamIndex = updateData.findIndex(item => {
                    return item.id == newData.whiteTeam.idTeam;
                });

                if (existingTeamIndex !== -1) {
                    updateData[existingTeamIndex].value = newData.count;
                } else {
                    updateData.push({
                        id: newData.whiteTeam.idTeam,
                        name: newData.whiteTeam.name,
                        votos: newData.count,
                        color: newData.whiteTeam.colorHex,
                        acronym: newData.whiteTeam.acronym
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
