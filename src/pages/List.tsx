import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonRow,
  IonCol,
  IonList,
  IonLabel,
  IonItem,
  IonGrid,
  IonButtons,
  IonBackButton,
  IonCardTitle
} from "@ionic/react";

import { logoWhatsapp , trash } from "ionicons/icons";
import { useStorage } from "@ionic/react-hooks/storage";
import React, { useState, useEffect } from "react";
import "./Tab1.css";
import { RouteComponentProps } from "react-router";
import { formatCurrency } from "../utils/currency";

export interface Item {
  itemName: string;
  itemWeigth: string;
  itemPrice: string;
  itemValue: number;
}

interface ListDetailsPageProps extends RouteComponentProps<{
  id: string;
}> { }

const List: React.FC<ListDetailsPageProps> = ({ match, history }) => {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [listName, setListName] = useState("");
  const [listCreatedAt, setListCreateAt] = useState("");
  const [totalValue, settotalValue] = useState(0);
  const { get, remove, getKeys } = useStorage();

  const openSocialSharing = async () => {
    let windowNavigator: any;
    windowNavigator = window.navigator;

    const data = itemList.map((item) => {
      return [`${item.itemName} - ${item.itemWeigth} \n`]
    }).toString().replace(/,/g, '')

    await windowNavigator.share({
      title: 'Lista - Compartilhada',
      text: data,
      url: '',
    })
  }

  useEffect(() => {

    const loadMainList = async () => {

      const listasString = await getKeys();

      const removeMainList = listasString.keys.filter((item) => item !== "mainlist")

      const filteredList = removeMainList.filter((item, index) => index === Number(match.params.id))

      setListName(filteredList[0])

      const listaString = await get(filteredList[0]);

      const lista = listaString ? JSON.parse(listaString) : {};

      setItemList(lista.items);
      setListCreateAt(lista.createdAt);

      const listValue = lista.items.reduce((acc: any, curr: any) => {
        return acc + curr.itemValue;
      }, 0);

      settotalValue(listValue);

    };
    loadMainList();
  }, [get, getKeys, match.params.id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab2" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardTitle style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>
            {`
                Lista Mercado
                ${new Date(listCreatedAt).toLocaleString('pt-BR')}
            `}
          </IonCardTitle>
          <IonList>
            {itemList.map((item, index) => (
              <IonItem key={`${index}`}>
                <IonLabel>
                  <IonRow className="ion-justify-content-between ion-align-items-center">
                    <h2>{item.itemName}</h2>
                  </IonRow>
                  <IonRow className="ion-justify-content-around itemDetails">
                    <span>Quant./Kg - </span>
                    {item.itemWeigth}
                    <span>V. Un. - </span>
                    {formatCurrency(item.itemPrice)}
                    <span>V. Tot. - </span>
                    {formatCurrency(item.itemValue.toFixed(2))}
                  </IonRow>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
          <IonRow>
            <IonCol>
              <IonButton
                color="danger"
                expand="block"
                onClick={async (e) => {
                  e.preventDefault()
                  remove(listName)
                  history.push('/tab1')
                }}
              >
                <IonIcon slot="end" icon={trash} />
                Deletar Lista
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
        <IonGrid>
          <IonRow>
            <IonCol >
              <IonButton color="primary" expand="full">
                {formatCurrency(totalValue.toFixed(2))}
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol >
              <IonButton color="success" expand="full" onClick={openSocialSharing}>
                <IonIcon slot="end" icon={logoWhatsapp}/>
                Compartilhar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default List;
