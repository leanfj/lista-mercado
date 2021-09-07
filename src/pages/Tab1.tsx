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
import React, { useState, useEffect, useCallback } from "react";
import "./Tab1.css";
import { formatCurrency } from "../utils/currency";

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
    get('darkModeStatus').then(
      (data: any) => {
        document.body.classList.toggle('dark', data);
      }
    )
    
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

  const handleChange = useCallback(
    (e) => {

      let value = e.target.value
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{2})$/, "$1,$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".")
      e.target.value = value

    },
    []
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista Mercado</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowCadNewItem(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
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
              attributes: {
                name: "itemName",
                tabIndex: 1
              }
            },
            {
              name: "itemWeigth",
              type: "number",
              placeholder: "Peso ou Unidade",
              handler: () => console.log('peso'),
              attributes: {
                inputMode: 'decimal',
                tabIndex: 2
              }
            },
            {
              name: "itemPrice",
              type: "text",
              placeholder: "Valor do Item",
              attributes: {
                inputMode: 'decimal',
                tabIndex: 3,
                onKeyUp: handleChange
              }
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
                let value = e.itemPrice;

                value = value.replace(/\./g, "");
                value = value.replace(/,/g, "");
                value = value.replace(/(\d)(\d{2})$/, "$1.$2");

                if (e.itemName && e.itemWeigth && e.itemPrice) {

                  const itemVal = Number(e.itemWeigth) * Number(value);
                  const itemValue = Number(itemVal.toFixed(2));
                  const newItems = [{ ...e, itemPrice: value, itemValue }, ...itemList];

                  setItemList(newItems);

                  settotalValue(totalValue + itemValue);

                  setShowToast(true);


                  set("mainlist", JSON.stringify(newItems));

                } else {

                  setShowToastError(true);
                }
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
          duration={500}
          color="success"
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
