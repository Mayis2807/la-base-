# Guía Completa para Pruebas de Envío de Correo Electrónico
## Requisitos Previos

**Antes de comenzar, es fundamental verificar que tenga instalados los siguientes componentes en su sistema:**

### Verificación de Instalaciones
MySQL:
    
        hmysql --version

Node.js y npm:

        node --version
        npm --version
    
Si alguno de estos comandos no funciona, deberá instalar las herramientas faltantes antes de continuar.
Instalación de Dependencias (si es necesario)

## INSTALACION
### MySQL

        sudo apt update
        sudo apt install mysql-server

### Node.js y npm

        sudo apt install nodejs npm

## CONFIGURACIÓN DEL ENTORNO
1. Archivo de Configuración (.env)

Cree un archivo .env en el directorio raíz del proyecto con la siguiente estructura: (Modificando lo necesario)
        
        O365_USER=email que usaras para el envio
        O365_PASS=contraseña
        DB_HOST=localhost
        DB_USER=Practicas
        DB_PASSWORD=Practicas
        DB_DATABASE=FeriaValencia

Nota: Para Gmail, necesitará generar una contraseña de aplicación específica en lugar de usar su contraseña regular.

2. Instalación de Dependencias de Node.js

Ejecute los siguientes comandos en el directorio del proyecto:

        npm init -y
        npm install mjml nodemailer mysql2 dotenv csv-parser

## Configuración de MySQL

1. Acceso como Usuario Root

        mysql -u root -p

2. Creación del Usuario de Prácticas

        CREATE USER 'Practicas'@'localhost' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON . TO 'Practicas'@'localhost' WITH GRANT OPTION;
        FLUSH PRIVILEGES;
        EXIT;

3. Creación de la Base de Datos

Acceda con el nuevo usuario:

        mysql -u Practicas -p

Cree la base de datos:

        CREATE DATABASE FeriaValencia;
        USE FeriaValencia;

4. Creación de Tablas

Consulte el archivo BBDD.txt para obtener las estructuras de tabla específicas. Un ejemplo típico sería:

        CREATE TABLE suscriptores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            telefono VARCHAR(15),
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            activo BOOLEAN DEFAULT TRUE
        );

## Estructura de Archivos del Proyecto

Descargue los siguientes archivos y guárdalos en una misma carpeta de su elección:

### Plantillas MJML:

-   Practic.mjml (Supuesto 1)
-   Practicomic.mjml (Supuesto 1.2)
-   Practic2.mjml (Supuesto 4)

### Scripts de Node.js:

-   Sendyregistro.js (archivo que permite realizar el envío del supuesto 1)
-   Sendycomic.js (archivo que permite realizar el envío del supuesto 1.2)
-   sendymotos.js (archivo que permite realizar el envío del supuesto 4)

### Archivos de datos:

Créelo con los campos correspondientes según se indica en el archivo
-   Suscriptores.csv 

### Archivo Java:

Diseñado para insertar datos en la base de datos - modifíquelo según sus campos si tiene una estructura diferente
-   Enviabbdd.java 

Una vez descargados todos los archivos, asegúrese de que estén organizados en la misma carpeta para facilitar su acceso durante las pruebas.

## Preparación de Datos
1. Archivo CSV de Suscriptores

Cree el archivo **suscriptores.csv** con la siguiente estructura:
        csv
        
        NOMBRE APELLIDO IDIOMA EMAIL AÑOS 
        Juan Pérez ingles juan.perez@email.com 23
        María García castellano maria.garcia@email.com 30

2. Compilación y Ejecución del Archivo Java
#### Compilación:
        javac -cp .:mysql-connector-java.jar Enviabbdd.java
#### Ejecución:
        java -cp .:mysql-connector-java.jar Enviabbdd
Nota: Asegúrese de tener el conector MySQL para Java descargado y en el classpath.

## Proceso de Prueba
1. Inserción de Datos en la Base de Datos

    Ejecute el programa Java para insertar los datos del CSV en la base de datos:
    
            java -cp .:mysql-connector-java.jar Enviabbdd

2. Verificación de Datos

    Confirme que los datos se insertaron correctamente:
    
            USE FeriaValencia;
            SELECT * FROM suscriptores;

3. Envío de Correos de Prueba

    Ejecute los scripts de Node.js según el supuesto que desee probar:

    #### Para el Supuesto 1:

            node scripts/Sendyregistro.js

    #### Para el Supuesto 1.2:
    
            node scripts/Sendycomic.js
    
    #### Para el Supuesto 4:
    
            node scripts/sendymotos.js

4. Verificación de Envío

   -   Revise la consola para confirmar que no hay errores.
   -   Verifique las bandejas de entrada de los correos especificados en el CSV
    
   -   Compruebe también las carpetas de spam/correo no deseado

## Solución de Problemas Comunes
### Error de Conexión a MySQL

- Verificar que el servicio MySQL esté ejecutándose
- Confirmar credenciales de usuario y contraseña
- Asegurar que el puerto 3306 esté disponible

### Error de Autenticación de Email

- Verificar configuración SMTP
- Para Gmail, usar contraseña de aplicación
- Confirmar que la autenticación de dos factores esté configurada correctamente

### Problemas con Plantillas MJML

- Validar sintaxis MJML
- Verificar que todas las dependencias estén instaladas
- Comprobar rutas de archivos

### Error de Permisos Java

- Verificar que el conector MySQL esté en el classpath
- Confirmar permisos de ejecución del archivo Java
- Asegurar compatibilidad de versiones Java/MySQL

