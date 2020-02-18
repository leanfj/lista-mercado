import React from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

export interface Item {
  itemName: string;
  itemWeigth: string;
  itemPrice: string;
  itemValue: number;
}
const Tab2: React.FC = () => {
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Listas Salvas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/">
            <IonLabel>
              <h2>Lista 01</h2>
              <span>01/01/2020</span>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
