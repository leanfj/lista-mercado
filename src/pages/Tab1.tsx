import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonRow,
  IonCol,
  IonList,
  IonLabel,
  IonItem,
  IonFab,
  IonFabButton,
  IonAlert,
  IonToast,
  IonGrid,
} from "@ionic/react";

import { trash, add, logoUsd, closeCircle, save } from "ionicons/icons";
import { useStorage } from "@ionic/react-hooks/storage";
import React, { useState, useEffect } from "react";
import "./Tab1.css";
import { RouteComponentProps } from "react-router";

export interface Item {
  itemName: string;
  itemWeigth: string;
  itemPrice: string;
  itemValue: number;
}


const Tab1: React.FC = () => {
  const [showCadNewItem, setShowCadNewItem] = useState(false);
  const [itemList, setItemList] = useState<Item[]>([]);
  const [totalValue, settotalValue] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const [showToastSaveError, setShowToastSaveError] = useState(false);
  const [showToastSaveSuccess, setShowToastSaveSuccess] = useState(false);


  const { get, set, remove } = useStorage();

  useEffect(() => {
    const loadMainList = async () => {
      const listaString = await get("mainlist");
      const lista = listaString ? JSON.parse(listaString) : [];

      setItemList(lista);
      const listValue = lista.reduce((acc: any, curr: any) => {
        return acc + curr.itemValue;
      }, 0);
      settotalValue(listValue);
    };
    loadMainList();
  }, [get]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista Mercado</IonTitle>
        </IonToolbar>
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowCadNewItem(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonHeader>
      <IonContent>
        <IonAlert
          isOpen={showCadNewItem}
          onDidDismiss={() => setShowCadNewItem(false)}
          header={"Novo Item"}
          inputs={[
            {
              name: "itemName",
              type: "text",
              placeholder: "Nome do Item",
            },
            {
              name: "itemWeigth",
              type: "number",
              placeholder: "Peso ou Unidade",
            },
            {
              name: "itemPrice",
              type: "number",
              placeholder: "Valor do Item",
            },
          ]}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setShowCadNewItem(false);
              },
            },
            {
              text: "Ok",
              handler: async (e) => {
                console.log(e);
                if (e.itemName && e.itemWeigth && e.itemPrice) {
                  const itemVal = Number(e.itemWeigth) * Number(e.itemPrice);
                  const itemValue = Number(itemVal.toFixed(2));
                  const newItems = [{ ...e, itemValue }, ...itemList];
                  setItemList(newItems);

                  settotalValue(totalValue + itemValue);

                  setShowToast(true);

                  set("mainlist", JSON.stringify(newItems));

                  return;
                }
                setShowToastError(true);
              },
            },
          ]}
        />
        <IonCard>
          <IonList>
            {itemList.map((item, index) => (
              <IonItem key={`${index}`}>
                <IonLabel>
                  <IonRow className="ion-justify-content-between ion-align-items-center">
                    <h2>{item.itemName}</h2>
                    <IonButton
                      color="danger"
                      size="small"
                      onClick={async () => {
                        const listaString = await get("mainlist");
                        const lista = listaString
                          ? JSON.parse(listaString)
                          : [];
                        const itemToRemove = lista.splice(index, 1);
                        set("mainlist", JSON.stringify(lista));
                        setItemList(lista);
                        settotalValue(totalValue - itemToRemove[0].itemValue);
                      }}
                    >
                      <IonIcon icon={closeCircle} />
                    </IonButton>
                  </IonRow>
                  <IonRow className="ion-justify-content-around itemDetails">
                    <span>Quant./Kg - </span>
                    {item.itemWeigth}
                    <span>V. Un. - </span>
                    <strong>R$</strong>
                    {item.itemPrice}
                    <span>V. Tot. - </span>
                    <strong>R$</strong> {item.itemValue.toFixed(2)}
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
                onClick={() => {
                  setItemList([]);
                  settotalValue(0);
                  remove("mainlist");
                }}
              >
                <IonIcon slot="end" icon={trash} />
                Limpar Lista
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="9">
              <IonButton color="primary" expand="full">
                <IonIcon slot="start" icon={logoUsd} />
                {totalValue.toFixed(2)}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                color="success"
                expand="full"
                onClick={async () => {
                  const listToSave = {
                    items: itemList,
                    createdAt: new Date().getTime(),
                  }

                  if (listToSave.items.length) {
                    await set(
                      `savedlist-${listToSave.createdAt}`,
                      JSON.stringify(listToSave)
                    );
                    setShowToastSaveSuccess(true);
                  } else {
                    setShowToastSaveError(true);
                    return;
                  }
                }}
              >
                <IonIcon icon={save} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Item incluído com SUCESSO"
          duration={200}
        />
        <IonToast
          isOpen={showToastError}
          onDidDismiss={() => setShowToastError(false)}
          message="Informe todos os DADOS"
          duration={500}
          color="danger"
        />
        <IonToast
          isOpen={showToastSaveSuccess}
          onDidDismiss={() => setShowToastSaveSuccess(false)}
          message="Lista Salva com Sucesso"
          duration={500}
          color="success"
        />
        <IonToast
          isOpen={showToastSaveError}
          onDidDismiss={() => setShowToastSaveError(false)}
          message="Sua lista esta VAZIA"
          duration={500}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
