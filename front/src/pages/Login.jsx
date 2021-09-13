import React, { useState, useContext } from 'react';

import NavBar from '../components/NavBar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import api from '../api';
import StoreContext from '../components/Store/Context';

import '../styles/login.css';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import triangulo from '../images/Downwardtriangle.png';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

function Login() {
    
    const history = useHistory();
    const {setToken} = useContext(StoreContext);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState({});
    const [formData, setFormData] = useState({
        email: "",
        senha: ""
    })

    const responseFacebook = (response) => {
        console.log(response);
    }

    const responseGoogle = (response) => {
        console.log(response);
    }


    function handle(e) {
        const newForm = { ...formData }
        newForm[e.target.id] = e.target.value;
        setFormData(newForm);
        console.log(newForm);
    }

    async function enviar(e) {

        e.preventDefault();
        
        const {email,senha} = formData;

        // FUNCAO PARA FAZER O LOGIN
        // SE FOR TRUE - RETORNA UM TOKEN(SIMPLES) 
        const { token, error } = await api.post("/usuarios/login", {
            email: email,
            senha: senha
        }).then((resposta) => {
            if(resposta.status === 200){
                return { token: '1234' };
            }
            return { error: 'Usuário ou senha inválido' };
        })

        // FUNCAO PARA PEGAR OS DADOS DO USUARIO LOGADO
        // ASSIM PODENDO FAZER CONSULTAS DPS USANDO SESSIONsTORAGE
        const getDadosUsuario = async () => {
            const response = await api.get(`/usuarios/email?email=${email}`);

            sessionStorage.setItem('@Hireit/idUsuario',response.data.idUsuario);
            sessionStorage.setItem('@Hireit/nome',response.data.nome);
            sessionStorage.setItem('@Hireit/email',response.data.email);
        }

        getDadosUsuario();
        if(token){
            setToken(token);
            return history.push("/search-projects");
        }
        setError(error);
        setFormData({
            email: "",
            senha: ""
        })
    }

    return (
        <>
            <NavBar/>
            <main className="container-login">
                <section className="section-title">
                    <h2>HIRE-IT</h2>
                    <p>
                        A HIRE-IT ajuda você a encontrar sua empresa ou freelancer ideal. <br />
                        Faça o login ou crie sua conta <span id="Txtagora">agora</span> e experimente os nossos serviços!</p>
                </section>
                <section className="section-login">
                    <div className="div-login">
                        <FacebookLogin
                            appId="1088597931155576"
                            autoLoad={false}
                            fields="name,email,picture"
                            icon="fa-facebook"
                            language="pt_BR"
                            cssClass="facebook-button"
                            textButton="Acesse com sua conta do Facebook"
                            callback={responseFacebook}
                        />
                        <GoogleLogin
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            className="google-button"
                            buttonText="Acesse com sua conta do Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                        />
                        <div className="text-line">
                            <hr />
                            <p>OU</p>
                            <hr />
                        </div>

                        <form onSubmit={(e) => enviar(e)}>
    
                            <FormInput
                                formInput="input-label"
                                id="email"
                                title="E-mail ou Username:"
                                type="text"
                                changeFunction={(e) => handle(e)}
                                idInput="email"
                                placeholder="email@hireit.com" />
                                
                            <FormInput
                                formInput="input-label"
                                id="senha"
                                title="Senha:"
                                type="password"
                                idInput="senha"
                                changeFunction={(e) => handle(e)}
                                placeholder="**********" />
                            <Button
                                classname="button-login"
                                title="ENTRAR"
                                tipo="submit"
                            />
                            <div className="text-line">
                                <hr />
                                <p>Não tem um cadastro?</p>
                                <hr />
                            </div>
                            <Link to="/cadastro">
                                <Button 
                                    classname="button-register" 
                                    title="CADASTRE-SE AGORA!" 
                                />
                            </Link>
                        </form>
                    </div>
                    <img id="Ptrinagulo" src={triangulo} alt="triangulo de continuidade de página" />
                </section>
            </main>
        </>
    )

}

export default Login;