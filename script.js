$(document).ready(function() {
    let currentPage = 1;
    const recordsPerPage = 5;

    function fetchRecords() {
        $.ajax({
            url: 'postgresql://josaba:ot6VbBXTrksEbHwfcN5SRbVTQnUEHH6r@dpg-d03vfmruibrs73f5vab0-a/registrosdb/registros',
            method: 'GET',
            success: function(data) {
                displayRecords(data);
            }
        });
    }

    function displayRecords(data) {
        const start = (currentPage - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const paginatedData = data.slice(start, end);

        const tableBody = $('#recordsTable tbody');
        tableBody.empty();

        paginatedData.forEach(record => {
            tableBody.append(`
                <tr>
                    <td>${record.nombre}</td>
                    <td>${record.elemento}</td>
                    <td>${record.etapa}</td>
                    <td>
                        <button class="edit" data-id="${record.id}">Editar</button>
                        <button class="delete" data-id="${record.id}">Borrar</button>
                    </td>
                </tr>
            `);
        });

        $('#pageInfo').text(`Página ${currentPage} de ${Math.ceil(data.length / recordsPerPage)}`);
    }

    $('#prevPage').click(function() {
        if (currentPage > 1) {
            currentPage--;
            fetchRecords();
        }
    });

    $('#nextPage').click(function() {
        currentPage++;
        fetchRecords();
    });

    $('#search').on('input', function() {
        const query = $(this).val().toLowerCase();
        $.ajax({
            url: 'postgresql://josaba:ot6VbBXTrksEbHwfcN5SRbVTQnUEHH6r@dpg-d03vfmruibrs73f5vab0-a/registrosdb/registros',
            method: 'GET',
            success: function(data) {
                const filteredData = data.filter(record => 
                    record.nombre.toLowerCase().includes(query) ||
                    record.elemento.toLowerCase().includes(query) ||
                    record.etapa.toLowerCase().includes(query)
                );
                displayRecords(filteredData);
            }
        });
    });

    $('#addRecord').click(function() {
        const newRecord = {
            nombre: prompt('Nombre:'),
            elemento: prompt('Elemento:'),
            etapa: prompt('Etapa:')
        };
        $.ajax({
            url: 'postgresql://josaba:ot6VbBXTrksEbHwfcN5SRbVTQnUEHH6r@dpg-d03vfmruibrs73f5vab0-a/registrosdb/registros',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newRecord),
            success: function() {
                fetchRecords();
            }
        });
    });

    $(document).on('click', '.edit', function() {
        const id = $(this).data('id');
        const nombre = prompt('Nuevo Nombre:');
        const elemento = prompt('Nuevo Elemento:');
        const etapa = prompt('Nueva Etapa:');
        $.ajax({
            url: `postgresql://josaba:ot6VbBXTrksEbHwfcN5SRbVTQnUEHH6r@dpg-d03vfmruibrs73f5vab0-a/registrosdb/registros/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ nombre, elemento, etapa }),
            success: function() {
                fetchRecords();
            }
        });
    });

    $(document).on('click', '.delete', function() {
        const id = $(this).data('id');
        $.ajax({
            url: `postgresql://josaba:ot6VbBXTrksEbHwfcN5SRbVTQnUEHH6r@dpg-d03vfmruibrs73f5vab0-a/registrosdb/registros/${id}`,
            method: 'DELETE',
            success: function() {
                fetchRecords();
            }
        });
    });

    fetchRecords();
});
