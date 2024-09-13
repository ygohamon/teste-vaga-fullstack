'use client';
import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import { DataTable } from 'primereact/datatable';
import {Column} from "primereact/column";
const Dashboard = () => {
    const [arquivo, setArquivo] = useState(null);
    const [resultado, setResultado] = useState(null);

    const handleFileChange = (e: any) => {
        setArquivo(e.target.files[0]);
    };

    const handleUpload = () => {
        if (arquivo) {
            const formData = new FormData();
            formData.append('file', arquivo);

            fetch('http://localhost:4000/test/upload', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    setResultado(data);
                })
                .catch((error) => {
                    console.error('Erro ao enviar o arquivo:', error);
                });
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h1>Validação de Dados CSV</h1>
                    <div className="flex" style={{ marginBottom: '2em' }}>
                        <InputText type="file" onChange={handleFileChange} style={{ marginRight: '1em' }} /><br/>
                        <Button onClick={handleUpload} label="Enviar"/>
                    </div>

                    {resultado && (
                        <div>
                            <h2>Resultados</h2>
                            <DataTable value={resultado} paginator rows={10}>
                                <Column field="nrCpfCnpj" header="CPF/CNPJ"></Column>
                                <Column field="cpfCnpj" header="CPF/CNPJ Válido" body={(rowData) => rowData.cpfCnpj ? 'Sim' : 'Não'}></Column>
                                <Column field="total" header="Valor Total"></Column>
                                <Column field="prestacao" header="Valor Prestação"></Column>
                                <Column field="valores" header="Parcelas Corretas" body={(rowData) => rowData.valores ? 'Sim' : 'Não'}></Column>
                            </DataTable>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
