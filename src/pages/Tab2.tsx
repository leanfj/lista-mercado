import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter
} from "@ionic/react";
import { useStorage } from "@ionic/react-hooks/storage";

const Tab2: React.FC = () => {

  const [lists, setLists] = useState<string[]>([]);

  const { get, getKeys } = useStorage()

  useIonViewDidEnter(() => {
    const loadMainList = async () => {
      const listasString = await getKeys();
      const removeMainList = listasString.keys.filter((item) => (item !== "mainlist" && item !== "darkModeStatus"))
      const removeEmpytList = removeMainList.filter(async (item) => {
        const list: any = await get(item)

        const parsedList = JSON.parse(list)
        if (parsedList.length !== 0) {
          return item;
        }
      })

      setLists(removeEmpytList)

    };

    loadMainList();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Listas Salvas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {lists.map((item, index) => (
            <IonItem routerLink={`list/${index}`} key={`${index}`}>
              <IonLabel>
                <h2>{`${item.substring(0, 9).toUpperCase()}`}</h2>
                <span>{`${new Date(Number(item.substring(10))).toLocaleString('pt-BR')}`}</span>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
