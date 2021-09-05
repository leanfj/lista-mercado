import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useStorage } from "@ionic/react-hooks/storage";
import { bug, trash } from "ionicons/icons";
import { RouteComponentProps } from "react-router";

interface ConfigPageProps extends RouteComponentProps<{
}> { }

const Tab3: React.FC<ConfigPageProps> = () => {
  const [showToastDeleteData, setShowToastDeleteData] = useState(false);

  const { clear } = useStorage()

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
            Deleter Dados
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
