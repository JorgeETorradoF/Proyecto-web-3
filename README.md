# Integrantes
- Jorge Eduardo Torrado Forero
- Juan Andrés Vásquez Velasco
- Erick Santiago Camargo
- Zenén Contreras Robayo
- Juan Diego Cifuentes


# Cómo ejecutar

Se debe tener Docker y Kubernetes (k8s) instalados.

Luego, se debe desplegar el Nginx Ingress Controller en k8s con el siguiente comando:
 ```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml -n ingress-nginx
 ```

Una vez se haya desplegado y tenga una IP externa (en algunos casos será localhost como por ejemplo en docker desktop), se puede continuar:

1. **Cree el namespace proyecto-web:**
    ```bash
    kubectl create namespace proyecto-web
    ```

2. **Se debe tener en ejecución el contenedor registry con el comando:**
    ```bash
    docker run -d -p 5000:5000 --name registry registry:2.7
    ```
    **Si ya ejecutó almenos 1 vez el run del registry, no es necesario volver a correrlo, solo se requiere encenderlo (en caso de que esté apagado) con el comando:**
   ```bash
    docker start registry
    ```

3. **Entre a la carpeta `postgre` y ejecute el script de build y push de imagen:**
    ```bash
    buildAndPush.bat dockersito-postgres
    ```
     **posdata: si le aparece algún error al buildear, abra con visual studio el archivo mvnw y cambiele sus caracteres especiales de crlf a lf**

4. **Entre a la carpeta `backEndWeb` y ejecute el script de build y push de imagen:**
    ```bash
    buildAndPush.bat backend_web
    ```
    **posdata: si le aparece algún error al buildear, abra con visual studio el archivo mvnw y cambiele sus caracteres especiales de crlf a lf**

5. **Entre a la carpeta `frontEndWeb` y ejecute el script de build y push de imagen:**
    ```bash
    buildAndPush.bat frontend_web
    ```
    **posdata: si le aparece algún error al buildear, abra con visual studio el archivo mvnw y cambiele sus caracteres especiales de crlf a lf**

6. **Entre a la carpeta `k8s` ubicada en la raíz de este proyecto y ejecute el script que automatiza la aplicación de las configuraciones del k8s:**
    ```bash
    aplicar_configuraciones_k8s.bat
    ```

7. **Para confirmar que todo salió bien ejecute el comando:**
    ```bash
    kubectl get pods -n proyecto-web
    ```

Deberían aparecerle 3 pods con estado `Running` y replicas `1/1`, en cuyo caso ya puede acceder desde su browser digitando la external ip que aparece en el nginx-controller de tipo LoadBalancer (digite este comando si necesita saberla):
   ```bash
   kubectl get svc -n ingress-nginx
   ```
    
## En caso de que realice algún cambio y quiera probarlo: 
- **Para desplegar y probar cambios en la base de datos:**
  - Repita los pasos 2 (solo la segunda parte de este paso) y 3.

- **Para desplegar y probar cambios en el backend:**
  - Repita los pasos 2 (solo la segunda parte de este paso) y 4.

- **Para desplegar y probar cambios en el frontend:**
  - Repita los pasos 2 (solo la segunda parte de este paso) y 5.

- **Para desplegar y probar todo (backend, frontend y base de datos):**
  - Repita los pasos 2 (solo la segunda parte de este paso), 3, 4 y 5.

## Y por último, ejecute el comando:
   ```bash
    kubectl delete pods --all -n proyecto-web
   ```
    
esto reiniciará los pods para que hagan pull a la nueva imagen que usted buildeó y pusheó en el paso de la posdata. Luego espere unos segundos o unos minutos y pruebe de nuevo digitando la external ip del nginx-controller

## Debugging:
- **Si requiere ver el estado de los pods:**
  ```bash
    kubectl get pods -n proyecto-web
   ```
- **Si algun pod no tiene en estado el  `Running` puede ver información de lo que salió mal con el comando:**
  ```bash
    kubectl logs -n proyecto-web <nombre del pod (se puede mirar con el comando get pods del punto anterior)>
   ```
  de aquí debe reemplazar el <nombre del pod (se puede mirar con el comando get pods del punto anterior)> con el verdadero nombre del pod
- **Si requiere acceder directamente al postgre:**
  ```bash
    kubectl exec -it -n proyecto-web <nombre del pod que tiene el postgres (se puede mirar con el comando get pods del primer punto de debugging)> -- /bin/bash
   ```
  de aquí debe reemplazar el <nombre del pod (se puede mirar con el comando get pods del del primer punto de debugging)> con el verdadero nombre del pod

