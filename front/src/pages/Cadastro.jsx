import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

import NavBar from '../components/NavBar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import api from '../api';
import axios from 'axios';

import '../styles/cadastro.css';

function Cadastro() {

    const history = useHistory();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        cep: "",
        descricao: "Desenvolvedor dev",
        senha: "",
        telefone:""
    })
    const {cep} = formData;
    
    function handle(e) {
        const newForm = { ...formData }
        newForm[e.target.id] = e.target.value;
        setFormData(newForm);
        console.log(newForm);
    }

    // FAZ A CONSULTA NO BANCO LOCAL DO CEP - SE NAO EXISTIR
    // RETORNA O COD:400 E VAI PARA A OUTRA FUNCAO
    const getCepLocal = async () => {
        const response = await api.get(`/localizacoes/cep/${cep}`);
        // .catch(
        //     function(error){
        //         if(error.response){ return error.response; }
        //     }
        // );
        if(response.status === 200){
            return response.data;
        }else{
            return getCepApi();        
        }
    }

    //ESSA FUNCAO PEGA O CEP LOCAL E FAZ A CONSULTA NA API
    //DEPOIS DE TER OS DADOS CADASTRA O NECESSARIO NO NOSSO BANCO
    const getCepApi = async () => {
        const responseDois = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        var cepComHifen = responseDois.data.cep;

        var cepSemHifen = cepComHifen.replace("-","");

        const resposta = await api.post("/localizacoes/",{
            cidade: responseDois.data.localidade,
            uf: responseDois.data.uf,
            cep: cepSemHifen,
        });
        return resposta.data;
    }

    async function enviar(e) {
        e.preventDefault();
        const cepLocal = await getCepLocal();
        const {nome,email,descricao,senha,telefone} = formData;
        const { idLocalizacao } = cepLocal;

        await api.post("/usuarios", {
            nome: nome,
            email: email,
            senha: senha,
            descricao: descricao,
            telefone: telefone,
            localizacao: {
                idLocalizacao,
            },
        }).then((resposta) => {
            console.log("ok", resposta);
            if(resposta.status === 201){
                alert("usuario criado com sucesso");
                history.push("/login");
            }
        })

    }

    return (
        <>
            <NavBar/>
            <div className="container">
                <section className="section-cadastro">
                    <div className="div-cadastro">
                        <div className="div-titulo">
                            <h2>CADASTRE-SE</h2>
                        </div>
                        <form onSubmit={(e) => enviar(e)}>
                            <FormInput
                                formInput="input-label"
                                title="Nome Completo:"
                                type="text"
                                idInput="nome"
                                changeFunction={(e) => handle(e)}
                                placeholder="Nome Completo" />

                            <FormInput
                                formInput="input-label"
                                title="E-mail:"
                                type="text"
                                idInput="email"
                                changeFunction={(e) => handle(e)}
                                placeholder="Ex.: email@hireit.com" />

                            <FormInput
                                formInput="input-label"
                                title="CEP:"
                                type="cep"
                                idInput="cep"
                                changeFunction={(e) => handle(e)}
                                placeholder="Ex.: 00.000-000"/>
                            <FormInput
                                formInput="input-label"
                                title="Telefone:"
                                type="telefone"
                                idInput="telefone"
                                changeFunction={(e) => handle(e)}
                                placeholder="Ex.: 00000-0000"/>
                                        
                            <FormInput
                                formInput="input-label"
                                title="Senha:"
                                type="password"
                                idInput="senha"
                                changeFunction={(e) => handle(e)}
                                placeholder="Ex.: **********" />
                            <FormInput
                                formInput="input-label"
                                title="Confirmar Senha:"
                                type="password"
                                idInput="cofirm-senha"
                                changeFunction={(e) => handle(e)}
                                placeholder="Ex.: **********" />
                            
                            <Button 
                                classname="button-cadastrar" 
                                title="Cadastrar"
                                />

                        </form>
                    </div>
                </section>
                <section className="section-texto">
                    <h2>HIRE-IT</h2>
                    <p>
                        A HIRE-IT ajuda você a encontrar sua empresa ou freelancer ideal. <br />
                        Faça o cadastro para ter acesso ao nosso
                        <span id="Txtagora"> Teste de Personalidade</span> exclusivo, para melhorar cada vez mais sua experiência!</p>
                </section>
            </div>


        </>
    )
}

export default Cadastro;