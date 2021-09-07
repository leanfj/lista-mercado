import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import { useStorage } from "@ionic/react-hooks/storage";
import { bug, trash } from "ionicons/icons";
import { RouteComponentProps } from "react-router";

interface ConfigPageProps extends RouteComponentProps<{
}> { }

const Tab3: React.FC<ConfigPageProps> = () => {
  const [showToastDeleteData, setShowToastDeleteData] = useState(false)
  const [darkModeStatus, setDarkModeStatus] = useState(false)
  const { clear, set, get } = useStorage()

  const onToggle = (e: any) => {
    document.body.classList.toggle('dark', e.detail.checked)
    set('darkModeStatus', e.detail.checked)
    setDarkModeStatus(e.detail.checked)
  }

  useIonViewDidEnter(() => {
    const onPageLoad = () => {
      get('darkModeStatus').then(
        (data: any) => {
          setDarkModeStatus(data)
        }
      )
    }
    onPageLoad()
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configurações</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonText style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 >Lista Mercado App</h1>
            <p style={{ fontSize: 20 }}>Desenvolvido por:</p>
            <a style={{ fontSize: 18 }} href="https://github.com/leanfj" rel="noreferrer noopener" target="_blank">Leandro Ferreira</a>
          </IonText>

          <IonItem style={{marginTop: 20}}>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle value="darkMode" onIonChange={onToggle} checked={darkModeStatus}/>
          </IonItem>

          <a href="https://github.com/leanfj/lista-mercado/issues/new" rel="noreferrer noopener" target="_blank">
            <IonButton
              style={{ margin: 20 }}
              color="primary"
              expand="block"
            >
              Bug Report
              <IonIcon slot="end" icon={bug} />
            </IonButton>
          </a>
          
          <IonButton
            style={{ margin: 20 }}
            color="danger"
            expand="block"
            onClick={async (e) => {
              e.preventDefault()
              clear()
              setShowToastDeleteData(true)
            }}
          >
            <IonIcon slot="end" icon={trash} />
            Deletar Dados
          </IonButton>
        </IonCard>
        <IonToast
          isOpen={showToastDeleteData}
          onDidDismiss={() => setShowToastDeleteData(false)}
          message="Dados deletados com sucesso"
          color="success"
          duration={500}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
